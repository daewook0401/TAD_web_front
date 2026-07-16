import { expect, test } from '@playwright/test';
import pg from 'pg';
import { createClient } from 'redis';

const { Pool } = pg;

const FRONTEND_URL = process.env.FRONTEND_URL || 'http://127.0.0.1:5173';
const API_BASE_URL = process.env.API_BASE_URL || 'http://127.0.0.1:8080/api';
const DATABASE_URL = process.env.DATABASE_URL || 'postgres://tad:tad@127.0.0.1:5432/tad';
const REDIS_URL = process.env.REDIS_URL || 'redis://127.0.0.1:6379';

const runId = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
const testUser = {
  email: `local-e2e-${runId}@example.com`,
  nickname: `e2e${runId.replace(/[^a-z0-9]/gi, '').slice(-12)}`,
  password: 'LocalTest123!',
};
const postTitle = `로컬 자동 테스트 게시글 ${runId}`;
const postBody = `Playwright local smoke test body ${runId}`;
const commentBody = `자동 테스트 댓글 ${runId}`;
const updatedNickname = `e2eup${runId.replace(/[^a-z0-9]/gi, '').slice(-10)}`;

let dbPool;
let redisClient;
let createdPostId;

const ensureLocalSchema = async () => {
  await dbPool.query(`
    CREATE SCHEMA IF NOT EXISTS analysis;

    CREATE TABLE IF NOT EXISTS analysis.tb_player (
      id BIGSERIAL PRIMARY KEY,
      player_name VARCHAR(50) NOT NULL UNIQUE,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS analysis.tb_game (
      id BIGSERIAL PRIMARY KEY,
      uploader_id BIGINT,
      bucket VARCHAR(100) NOT NULL,
      object_key VARCHAR(500) NOT NULL UNIQUE,
      screenshot_url TEXT NOT NULL,
      winner VARCHAR(10),
      status VARCHAR(20) NOT NULL DEFAULT 'DRAFT',
      confirmed_at TIMESTAMP,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT fk_game_uploader
        FOREIGN KEY (uploader_id) REFERENCES auth.tb_user(id) ON DELETE SET NULL
    );

    CREATE TABLE IF NOT EXISTS analysis.tb_game_player_stat (
      id BIGSERIAL PRIMARY KEY,
      game_id BIGINT NOT NULL,
      player_id BIGINT,
      player_name_snapshot VARCHAR(50),
      team_key VARCHAR(10) NOT NULL,
      slot_number INT NOT NULL,
      kills INT,
      deaths INT,
      assists INT,
      cs INT,
      gold INT,
      is_winner BOOLEAN NOT NULL,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT fk_game_player_stat_game
        FOREIGN KEY (game_id) REFERENCES analysis.tb_game(id) ON DELETE CASCADE,
      CONSTRAINT fk_game_player_stat_player
        FOREIGN KEY (player_id) REFERENCES analysis.tb_player(id) ON DELETE SET NULL,
      CONSTRAINT uq_game_team_slot UNIQUE (game_id, team_key, slot_number)
    );

    CREATE INDEX IF NOT EXISTS idx_game_player_stat_game
      ON analysis.tb_game_player_stat (game_id);
    CREATE INDEX IF NOT EXISTS idx_game_player_stat_player
      ON analysis.tb_game_player_stat (player_id);
    CREATE INDEX IF NOT EXISTS idx_game_uploader_created_at
      ON analysis.tb_game (uploader_id, created_at DESC);

    CREATE TABLE IF NOT EXISTS board.tb_post_attachment (
      id BIGSERIAL PRIMARY KEY,
      post_id BIGINT NOT NULL,
      file_url TEXT NOT NULL,
      file_name VARCHAR(255),
      stored_name VARCHAR(255),
      content_type VARCHAR(100),
      file_size BIGINT,
      file_kind VARCHAR(20) NOT NULL DEFAULT 'file',
      sort_order INT NOT NULL DEFAULT 0,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT fk_post_attachment_post
        FOREIGN KEY (post_id) REFERENCES board.tb_post(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS board.tb_comment_attachment (
      id BIGSERIAL PRIMARY KEY,
      comment_id BIGINT NOT NULL,
      file_url TEXT NOT NULL,
      file_name VARCHAR(255),
      stored_name VARCHAR(255),
      content_type VARCHAR(100),
      file_size BIGINT,
      file_kind VARCHAR(20) NOT NULL DEFAULT 'file',
      sort_order INT NOT NULL DEFAULT 0,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT fk_comment_attachment_comment
        FOREIGN KEY (comment_id) REFERENCES board.tb_comment(id) ON DELETE CASCADE
    );

    CREATE INDEX IF NOT EXISTS idx_post_attachment_post
      ON board.tb_post_attachment (post_id, sort_order, id);
    CREATE INDEX IF NOT EXISTS idx_comment_attachment_comment
      ON board.tb_comment_attachment (comment_id, sort_order, id);
  `);
};

const requestJson = async (url, options = {}) => {
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  });

  const body = await response.text();
  let data = null;
  if (body) {
    try {
      data = JSON.parse(body);
    } catch {
      data = body;
    }
  }

  if (!response.ok) {
    throw new Error(`${options.method || 'GET'} ${url} failed: ${response.status} ${body}`);
  }

  return data;
};

const ensureLocalSeedData = async () => {
  await dbPool.query(`
    INSERT INTO auth.tb_role (role_name, description)
    VALUES
      ('ROLE_USER', '일반 사용자'),
      ('ROLE_ADMIN', '관리자')
    ON CONFLICT (role_name) DO NOTHING
  `);

  await dbPool.query(`
    INSERT INTO board.tb_post_categories (category_key, name, icon_url, summary, display_order)
    VALUES
      ('lol', '롤', 'https://drive.towardadiamond.com/public/tad/category-icons/lol.webp', '롤 게시판', 1),
      ('maple', '메이플랜드', 'https://drive.towardadiamond.com/public/tad/category-icons/maple.webp', '메이플랜드 게시판', 2),
      ('free', '자유', null, '자유 게시판', 3)
    ON CONFLICT (category_key) DO NOTHING
  `);
};

const signupTestUser = async () => {
  await redisClient.set(`auth:email:verified:${testUser.email}`, 'true', { EX: 1800 });

  await requestJson(`${API_BASE_URL}/auth/signup`, {
    method: 'POST',
    body: JSON.stringify({
      nickname: testUser.nickname,
      email: testUser.email,
      password: testUser.password,
    }),
  });
};

const runIfTableExists = async (tableName, sql, params = []) => {
  const table = await dbPool.query('SELECT to_regclass($1) AS table_name', [tableName]);
  if (table.rows[0]?.table_name) {
    await dbPool.query(sql, params);
  }
};

const cleanupTestData = async () => {
  if (!dbPool) {
    return;
  }

  const postResult = await dbPool.query(
    `
      SELECT p.id
      FROM board.tb_post p
      JOIN auth.tb_user u ON u.id = p.author_id
      WHERE u.email LIKE 'local-e2e-%@example.com'
      UNION
      SELECT id FROM board.tb_post WHERE title = $1
    `,
    [postTitle],
  );
  const postIds = [...new Set([...(createdPostId ? [createdPostId] : []), ...postResult.rows.map((row) => row.id)])];

  for (const postId of postIds) {
    await dbPool.query('DELETE FROM board.tb_post_like WHERE post_id = $1', [postId]);
    await runIfTableExists(
      'board.tb_comment_attachment',
      'DELETE FROM board.tb_comment_attachment WHERE comment_id IN (SELECT id FROM board.tb_comment WHERE post_id = $1)',
      [postId],
    );
    await dbPool.query('DELETE FROM board.tb_comment WHERE post_id = $1', [postId]);
    await runIfTableExists('board.tb_post_attachment', 'DELETE FROM board.tb_post_attachment WHERE post_id = $1', [
      postId,
    ]);
    await dbPool.query('DELETE FROM board.tb_post WHERE id = $1', [postId]);
  }

  const user = await dbPool.query(
    "SELECT id FROM auth.tb_user WHERE email = $1 OR email LIKE 'local-e2e-%@example.com'",
    [testUser.email],
  );
  for (const row of user.rows) {
    await dbPool.query('DELETE FROM auth.tb_login_history WHERE user_id = $1', [row.id]);
    await dbPool.query('DELETE FROM auth.tb_user_role WHERE user_id = $1', [row.id]);
    await dbPool.query('DELETE FROM auth.tb_user WHERE id = $1', [row.id]);
  }
};

test.beforeAll(async () => {
  await requestJson(`${API_BASE_URL}/actuator/health`);

  dbPool = new Pool({ connectionString: DATABASE_URL });
  redisClient = createClient({ url: REDIS_URL });
  redisClient.on('error', (error) => {
    throw error;
  });
  await redisClient.connect();

  await ensureLocalSchema();
  await cleanupTestData();
  await ensureLocalSeedData();
  await signupTestUser();
});

test.afterAll(async () => {
  await cleanupTestData();
  if (redisClient?.isOpen) {
    await redisClient.del(`auth:email:verified:${testUser.email}`);
    await redisClient.quit();
  }
  await dbPool?.end();
});

test('local signup setup, login, board post, and comment flow works', async ({ page }) => {
  await page.goto(`${FRONTEND_URL}/login`);

  await page.getByLabel('이메일').fill(testUser.email);
  await page.getByLabel('비밀번호').fill('WrongLocalTest123!');
  await page.getByRole('button', { name: '로그인', exact: true }).click();
  await expect(page.getByText('이메일 또는 비밀번호가 올바르지 않습니다.')).toBeVisible();

  await page.getByLabel('비밀번호').fill(testUser.password);
  await page.getByRole('button', { name: '로그인', exact: true }).click();

  await expect(page).toHaveURL(/\/matches\/my/);

  await page.goto(`${FRONTEND_URL}/board/free/write`);
  await expect(page.getByRole('heading', { name: /글쓰기/ })).toBeVisible();

  await page.getByLabel('제목').fill(postTitle);
  await page.getByLabel('태그').fill('local-e2e');
  await page.locator('.board-write__editor').fill(postBody);
  await page.getByRole('button', { name: '게시글 등록' }).click();

  await expect(page).toHaveURL(/\/board\/.*\/post\/\d+/);
  const url = page.url();
  createdPostId = Number(url.match(/\/post\/(\d+)/)?.[1]);

  await expect(page.getByRole('heading', { name: postTitle })).toBeVisible();
  await expect(page.getByText(postBody)).toBeVisible();

  await page.getByPlaceholder('댓글을 입력해주세요.').fill(commentBody);
  await page.getByRole('button', { name: '댓글 등록' }).click();

  await expect(page.getByText(commentBody)).toBeVisible();

  await page.goto(`${FRONTEND_URL}/mypage`);
  await expect(page.getByRole('heading', { name: '마이페이지' })).toBeVisible();
  const recentPostsSection = page.locator('.mypage__card').filter({
    has: page.getByRole('heading', { name: '최근 게시글' }),
  });
  const recentCommentsSection = page.locator('.mypage__card').filter({
    has: page.getByRole('heading', { name: '최근 댓글' }),
  });
  const securitySection = page.locator('.mypage__card').filter({
    has: page.getByRole('heading', { name: '보안' }),
  });

  await expect(recentPostsSection).toBeVisible();
  await expect(recentPostsSection.getByText(postTitle, { exact: true })).toBeVisible();
  await expect(recentCommentsSection.getByText(commentBody, { exact: true })).toBeVisible();
  await expect(securitySection.getByText('최근 실패 시도')).toBeVisible();
  await expect(securitySection.getByText('1회', { exact: true })).toBeVisible();

  await page.getByRole('button', { name: '수정' }).click();
  await page.getByLabel('닉네임').fill(updatedNickname);
  await page.getByRole('button', { name: '저장' }).click();
  await expect(page.getByText('프로필이 수정되었습니다.')).toBeVisible();
  await expect(page.locator('.mypage__profile-card').getByText(updatedNickname, { exact: true })).toBeVisible();
});
