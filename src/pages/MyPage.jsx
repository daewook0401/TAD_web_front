import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../provider/AuthContext';
import { authAPI } from '../api/authAPI';
import '../styles/pages/MyPage.css';

const emptySummary = {
  stats: {
    postCount: 0,
    commentCount: 0,
    analysisRecordCount: 0,
    loginCount: 0,
  },
  security: {
    failedLoginCount: 0,
    lastSuccessfulLogin: null,
    lastFailedLogin: null,
  },
  recentPosts: [],
  recentComments: [],
  recentAnalysisRecords: [],
  recentLogins: [],
};

const normalizeSummary = (summary) => ({
  stats: {
    ...emptySummary.stats,
    ...(summary?.stats || {}),
  },
  security: {
    ...emptySummary.security,
    ...(summary?.security || {}),
  },
  recentPosts: summary?.recentPosts || [],
  recentComments: summary?.recentComments || [],
  recentAnalysisRecords: summary?.recentAnalysisRecords || [],
  recentLogins: summary?.recentLogins || [],
});

const formatDateValue = (dateStr, formatter) => {
  if (!dateStr) return '-';

  const date = new Date(dateStr);
  if (Number.isNaN(date.getTime())) {
    return '-';
  }

  return formatter(date);
};

const formatDate = (dateStr) => {
  return formatDateValue(dateStr, (date) => date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }));
};

const formatDateTime = (dateStr) => {
  return formatDateValue(dateStr, (date) => date.toLocaleString('ko-KR', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }));
};

const truncateText = (value, maxLength = 70) => {
  if (!value) return '-';
  return value.length > maxLength ? `${value.slice(0, maxLength)}...` : value;
};

const analysisStatusLabel = (status) => {
  const normalizedStatus = status?.toUpperCase();
  if (normalizedStatus === 'CONFIRMED') return '확정';
  if (normalizedStatus === 'FAILED') return '실패';
  if (normalizedStatus === 'DRAFT') return '검토 필요';
  return status || '대기';
};

const loginResultLabel = (result) => {
  const normalizedResult = result?.toUpperCase();
  if (normalizedResult === 'SUCCESS') return '성공';
  if (normalizedResult === 'FAILURE') return '실패';
  if (normalizedResult === 'BLOCKED') return '차단';
  return result || '기록';
};

const loginResultClass = (result) => {
  const normalizedResult = result?.toUpperCase();
  if (normalizedResult === 'SUCCESS') return 'success';
  if (normalizedResult === 'FAILURE' || normalizedResult === 'BLOCKED') return 'warning';
  return 'default';
};

const formatLoginSummary = (login) => {
  if (!login) return '기록 없음';
  return `${formatDateTime(login.createdAt)} · ${login.device || '알 수 없음'}`;
};

const MyPage = () => {
  const { user, isAuthenticated, isAdmin, isLoading: isAuthLoading, updateUser } = useAuth();
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [summary, setSummary] = useState(emptySummary);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ nickname: '' });
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const displayProfile = profile || user || {};
  const stats = summary.stats;
  const security = summary.security;
  const avatarText = (displayProfile.nickname || displayProfile.email || 'U').charAt(0).toUpperCase();

  const statItems = useMemo(() => [
    { label: '게시글', value: stats.postCount, to: '/board' },
    { label: '댓글', value: stats.commentCount, to: '/board' },
    { label: '전적 기록', value: stats.analysisRecordCount, to: '/matches/my' },
    { label: '로그인', value: stats.loginCount, to: null },
  ], [stats]);

  const fetchMyPage = useCallback(async () => {
    setIsLoading(true);
    setError('');

    try {
      const profileResponse = await authAPI.getMyProfile();
      const nextProfile = profileResponse.data;
      setProfile(nextProfile);
      setEditForm({ nickname: nextProfile.nickname || '' });
      updateUser(nextProfile);

      try {
        const summaryResponse = await authAPI.getMySummary();
        setSummary(normalizeSummary(summaryResponse.data));
      } catch (summaryError) {
        console.error('Failed to load my page summary:', summaryError);
        setSummary(emptySummary);
        setError('활동 요약 일부를 불러오지 못했습니다.');
      }
    } catch {
      setError('프로필 정보를 불러오는데 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  }, [updateUser]);

  useEffect(() => {
    if (isAuthLoading) {
      return;
    }

    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    fetchMyPage();
  }, [fetchMyPage, isAuthenticated, isAuthLoading, navigate]);

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const nickname = editForm.nickname.trim();
    if (nickname.length < 2 || nickname.length > 20) {
      setError('닉네임은 2자 이상 20자 이하로 입력해주세요.');
      return;
    }

    try {
      setIsSavingProfile(true);
      const response = await authAPI.updateMyProfile({ nickname });
      setProfile(response.data);
      setEditForm({ nickname: response.data.nickname || '' });
      updateUser(response.data);
      setIsEditing(false);
      setSuccess('프로필이 수정되었습니다.');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || '프로필 수정에 실패했습니다.');
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
      setError('모든 비밀번호 필드를 입력해주세요.');
      return;
    }

    if (passwordForm.newPassword.length < 8) {
      setError('새 비밀번호는 최소 8자 이상이어야 합니다.');
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setError('새 비밀번호가 일치하지 않습니다.');
      return;
    }

    try {
      setIsChangingPassword(true);
      await authAPI.changePassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });
      setShowPasswordForm(false);
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setSuccess('비밀번호가 변경되었습니다.');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || '비밀번호 변경에 실패했습니다.');
    } finally {
      setIsChangingPassword(false);
    }
  };

  const cancelProfileEdit = () => {
    setIsEditing(false);
    setEditForm({ nickname: displayProfile.nickname || '' });
    setError('');
  };

  const cancelPasswordEdit = () => {
    setShowPasswordForm(false);
    setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    setError('');
  };

  if (isAuthLoading || isLoading) {
    return (
      <div className="mypage">
        <div className="mypage__loading">로딩 중...</div>
      </div>
    );
  }

  return (
    <div className="mypage">
      <div className="mypage__container">
        <header className="mypage__header">
          <div>
            <p className="mypage__eyebrow">계정 관리</p>
            <h1 className="mypage__title">마이페이지</h1>
          </div>
          <Link className="mypage__primary-link" to="/board/free/write">글쓰기</Link>
        </header>

        {error && (
          <div className="mypage__message mypage__message--error" role="alert">
            <p>{error}</p>
          </div>
        )}
        {success && (
          <div className="mypage__message mypage__message--success" role="status">
            <p>{success}</p>
          </div>
        )}

        <div className="mypage__layout">
          <main className="mypage__main">
            <section className="mypage__card mypage__profile-card">
              <div className="mypage__card-header">
                <h2 className="mypage__card-title">프로필 정보</h2>
                {!isEditing && (
                  <button className="mypage__edit-btn" onClick={() => setIsEditing(true)}>
                    수정
                  </button>
                )}
              </div>

              <div className="mypage__profile">
                <div className="mypage__avatar">{avatarText}</div>
                <div className="mypage__info">
                  {isEditing ? (
                    <form onSubmit={handleEditSubmit} className="mypage__edit-form">
                      <div className="mypage__form-group">
                        <label className="mypage__label" htmlFor="mypage-nickname">닉네임</label>
                        <input
                          id="mypage-nickname"
                          type="text"
                          value={editForm.nickname}
                          onChange={(e) => setEditForm({ nickname: e.target.value })}
                          className="mypage__input"
                          maxLength={20}
                          autoComplete="nickname"
                        />
                      </div>
                      <div className="mypage__edit-actions">
                        <button type="submit" className="mypage__save-btn" disabled={isSavingProfile}>
                          {isSavingProfile ? '저장 중' : '저장'}
                        </button>
                        <button type="button" className="mypage__cancel-btn" onClick={cancelProfileEdit}>
                          취소
                        </button>
                      </div>
                    </form>
                  ) : (
                    <>
                      <div className="mypage__identity">
                        <strong>{displayProfile.nickname || '-'}</strong>
                        {isAdmin() && <span className="mypage__admin-badge">관리자</span>}
                      </div>
                      <div className="mypage__info-row">
                        <span className="mypage__info-label">이메일</span>
                        <span className="mypage__info-value">{displayProfile.email || '-'}</span>
                      </div>
                      <div className="mypage__info-row">
                        <span className="mypage__info-label">이메일 인증</span>
                        <span className="mypage__info-value">
                          {displayProfile.emailVerified ? (
                            <span className="mypage__verified">인증됨</span>
                          ) : (
                            <span className="mypage__unverified">미인증</span>
                          )}
                        </span>
                      </div>
                      <div className="mypage__info-row">
                        <span className="mypage__info-label">가입일</span>
                        <span className="mypage__info-value">{formatDate(displayProfile.createdAt)}</span>
                      </div>
                      <div className="mypage__info-row">
                        <span className="mypage__info-label">마지막 로그인</span>
                        <span className="mypage__info-value">{formatDateTime(displayProfile.lastLoginAt)}</span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </section>

            <section className="mypage__stats" aria-label="활동 요약">
              {statItems.map((item) => {
                const content = (
                  <>
                    <span className="mypage__stat-label">{item.label}</span>
                    <strong className="mypage__stat-value">{item.value ?? 0}</strong>
                  </>
                );

                return item.to ? (
                  <Link key={item.label} className="mypage__stat-card" to={item.to}>
                    {content}
                  </Link>
                ) : (
                  <div key={item.label} className="mypage__stat-card">
                    {content}
                  </div>
                );
              })}
            </section>

            <section className="mypage__card">
              <div className="mypage__card-header">
                <h2 className="mypage__card-title">최근 게시글</h2>
                <Link className="mypage__text-link" to="/board">게시판 보기</Link>
              </div>
              <div className="mypage__list">
                {summary.recentPosts.length > 0 ? summary.recentPosts.map((post) => (
                  <Link key={post.id} className="mypage__activity-item" to={`/board/${post.categoryKey}/post/${post.id}`}>
                    <span className="mypage__activity-meta">{post.categoryName} · {formatDate(post.createdAt)}</span>
                    <strong>{post.title}</strong>
                    <span className="mypage__activity-stats">
                      조회 {post.viewCount ?? 0} · 좋아요 {post.likeCount ?? 0} · 댓글 {post.replyCount ?? 0}
                    </span>
                  </Link>
                )) : (
                  <p className="mypage__empty">작성한 게시글이 없습니다.</p>
                )}
              </div>
            </section>

            <section className="mypage__card">
              <div className="mypage__card-header">
                <h2 className="mypage__card-title">최근 댓글</h2>
              </div>
              <div className="mypage__list">
                {summary.recentComments.length > 0 ? summary.recentComments.map((comment) => (
                  <Link key={comment.id} className="mypage__activity-item" to={`/board/${comment.categoryKey}/post/${comment.postId}`}>
                    <span className="mypage__activity-meta">{comment.categoryName} · {formatDate(comment.createdAt)}</span>
                    <strong>{comment.postTitle}</strong>
                    <span className="mypage__activity-stats">{truncateText(comment.content)}</span>
                  </Link>
                )) : (
                  <p className="mypage__empty">작성한 댓글이 없습니다.</p>
                )}
              </div>
            </section>
          </main>

          <aside className="mypage__side">
            <section className="mypage__card">
              <div className="mypage__card-header">
                <h2 className="mypage__card-title">바로가기</h2>
              </div>
              <div className="mypage__quick-links">
                <Link to="/matches/my">내 전적</Link>
                <Link to="/matches/search">플레이어 검색</Link>
                <Link to="/board/free/write">게시글 작성</Link>
                {isAdmin() && <Link to="/admin">관리자 페이지</Link>}
              </div>
            </section>

            <section className="mypage__card">
              <div className="mypage__card-header">
                <h2 className="mypage__card-title">보안</h2>
              </div>

              <div className="mypage__security-list" aria-label="로그인 보안 요약">
                <div className="mypage__security-row">
                  <span>마지막 성공 로그인</span>
                  <strong>{formatLoginSummary(security.lastSuccessfulLogin)}</strong>
                </div>
                <div className="mypage__security-row">
                  <span>최근 실패 시도</span>
                  <strong>{formatLoginSummary(security.lastFailedLogin)}</strong>
                </div>
                <div className="mypage__security-row">
                  <span>실패 기록</span>
                  <strong>{(security.failedLoginCount ?? 0).toLocaleString()}회</strong>
                </div>
              </div>

              {showPasswordForm ? (
                <form onSubmit={handlePasswordSubmit} className="mypage__password-form">
                  <div className="mypage__form-group">
                    <label className="mypage__label" htmlFor="current-password">현재 비밀번호</label>
                    <input
                      id="current-password"
                      type="password"
                      value={passwordForm.currentPassword}
                      onChange={(e) => setPasswordForm((prev) => ({ ...prev, currentPassword: e.target.value }))}
                      className="mypage__input"
                      autoComplete="current-password"
                    />
                  </div>
                  <div className="mypage__form-group">
                    <label className="mypage__label" htmlFor="new-password">새 비밀번호</label>
                    <input
                      id="new-password"
                      type="password"
                      value={passwordForm.newPassword}
                      onChange={(e) => setPasswordForm((prev) => ({ ...prev, newPassword: e.target.value }))}
                      className="mypage__input"
                      placeholder="8자 이상"
                      autoComplete="new-password"
                    />
                  </div>
                  <div className="mypage__form-group">
                    <label className="mypage__label" htmlFor="confirm-password">새 비밀번호 확인</label>
                    <input
                      id="confirm-password"
                      type="password"
                      value={passwordForm.confirmPassword}
                      onChange={(e) => setPasswordForm((prev) => ({ ...prev, confirmPassword: e.target.value }))}
                      className="mypage__input"
                      autoComplete="new-password"
                    />
                  </div>
                  <div className="mypage__edit-actions">
                    <button type="submit" className="mypage__save-btn" disabled={isChangingPassword}>
                      {isChangingPassword ? '변경 중' : '변경'}
                    </button>
                    <button type="button" className="mypage__cancel-btn" onClick={cancelPasswordEdit}>
                      취소
                    </button>
                  </div>
                </form>
              ) : (
                <button className="mypage__password-btn" onClick={() => setShowPasswordForm(true)}>
                  비밀번호 변경
                </button>
              )}
            </section>

            <section className="mypage__card">
              <div className="mypage__card-header">
                <h2 className="mypage__card-title">최근 전적 기록</h2>
                <Link className="mypage__text-link" to="/matches/my">전체 보기</Link>
              </div>
              <div className="mypage__list">
                {summary.recentAnalysisRecords.length > 0 ? summary.recentAnalysisRecords.map((record) => (
                  <Link
                    key={record.gameNumber}
                    className="mypage__activity-item"
                    to={record.reviewRequired ? `/matches/review/${record.gameNumber}` : '/matches/my'}
                  >
                    <span className="mypage__activity-meta">게임 #{record.gameNumber}</span>
                    <strong>{analysisStatusLabel(record.status)}</strong>
                    <span className="mypage__activity-stats">
                      {record.winner ? `승리팀 ${record.winner}` : '승리팀 미정'} · {formatDate(record.confirmedAt || record.createdAt)}
                    </span>
                  </Link>
                )) : (
                  <p className="mypage__empty">등록된 전적 기록이 없습니다.</p>
                )}
              </div>
            </section>

            <section className="mypage__card">
              <div className="mypage__card-header">
                <h2 className="mypage__card-title">최근 로그인</h2>
              </div>
              <div className="mypage__timeline">
                {summary.recentLogins.length > 0 ? summary.recentLogins.map((login) => (
                  <div key={login.id} className="mypage__timeline-item">
                    <strong className="mypage__timeline-title">
                      <span className={`mypage__login-result mypage__login-result--${loginResultClass(login.loginResult)}`}>
                        {loginResultLabel(login.loginResult)}
                      </span>
                      {login.device}
                    </strong>
                    <span>{login.loginType || 'NORMAL'} · {formatDateTime(login.createdAt)}</span>
                    <span>{login.ipAddress || 'IP 없음'}</span>
                  </div>
                )) : (
                  <p className="mypage__empty">로그인 기록이 없습니다.</p>
                )}
              </div>
            </section>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default MyPage;
