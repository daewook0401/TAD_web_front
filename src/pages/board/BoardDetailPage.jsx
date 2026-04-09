import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { boardAPI } from '../../api/boardAPI';
import '../../styles/pages/BoardPage.css';
import '../../styles/pages/BoardDetailPage.css';

const postTypeLabels = {
  free: '자유글',
  info: '정보글',
};

const formatDateTime = (value) => {
  if (!value) return '-';

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return '-';
  }

  return date.toLocaleString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const normalizePostContent = (post) => {
  if (post?.content?.includes('<')) return post.content;
  if (post?.content) {
    return post.content
      .split('\n')
      .filter((line) => line.trim().length > 0)
      .map((line) => `<p>${line}</p>`)
      .join('');
  }

  return '<p>본문이 없습니다.</p>';
};

const formatFileSize = (size) => {
  if (!size) return '0 B';
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${Math.ceil(size / 1024)} KB`;
  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
};

const getStoredUser = () => {
  try {
    const raw = sessionStorage.getItem('user');
    return raw ? JSON.parse(raw) : null;
  } catch (error) {
    console.error('사용자 세션 파싱 실패:', error);
    return null;
  }
};

const CommentItem = ({
  comment,
  depth = 0,
  replyDrafts,
  replyFiles,
  onReplyToggle,
  onReplyContentChange,
  onReplyFileChange,
  onReplyFileRemove,
  onReplySubmit,
  isAuthenticated,
  submittingReplyId,
}) => {
  const draft = replyDrafts[comment.id] || '';
  const attachedFiles = replyFiles[comment.id] || [];

  return (
    <div className={`board-comment ${depth > 0 ? 'board-comment--reply' : ''}`}>
      <div className="board-comment__head">
        <div>
          <strong>{comment.deleted ? '삭제된 댓글' : comment.authorNickname || '익명'}</strong>
          <span>{formatDateTime(comment.createdAt)}</span>
        </div>
        {!comment.deleted && isAuthenticated && (
          <button type="button" className="board-comment__reply-btn" onClick={() => onReplyToggle(comment.id)}>
            답글
          </button>
        )}
      </div>

      <div className="board-comment__body">
        {comment.content?.split('\n').map((line, index) => (
          <p key={`${comment.id}-${index}`}>{line}</p>
        ))}
      </div>

      {Array.isArray(comment.attachments) && comment.attachments.length > 0 && (
        <div className="board-comment__attachments">
          {comment.attachments.map((attachment) => (
            <a
              key={attachment.id}
              href={attachment.fileUrl}
              target="_blank"
              rel="noreferrer"
              className="board-comment__attachment"
            >
              {attachment.fileName}
            </a>
          ))}
        </div>
      )}

      {isAuthenticated && replyDrafts[comment.id] !== undefined && (
        <form className="board-comment__reply-form" onSubmit={(event) => onReplySubmit(event, comment.id)}>
          <textarea
            value={draft}
            onChange={(event) => onReplyContentChange(comment.id, event.target.value)}
            placeholder="답글을 입력해주세요."
            rows={3}
          />
          <div className="board-comment__reply-actions">
            <label className="board-comment__file-picker">
              이미지 첨부
              <input type="file" accept="image/*" multiple onChange={(event) => onReplyFileChange(comment.id, event)} />
            </label>
            <button type="submit" disabled={submittingReplyId === comment.id}>
              {submittingReplyId === comment.id ? '등록 중...' : '답글 등록'}
            </button>
          </div>

          {attachedFiles.length > 0 && (
            <div className="board-comment__draft-files">
              {attachedFiles.map((file) => (
                <button
                  key={`${comment.id}-${file.name}-${file.lastModified}`}
                  type="button"
                  className="board-comment__draft-file"
                  onClick={() => onReplyFileRemove(comment.id, file)}
                >
                  {file.name} ×
                </button>
              ))}
            </div>
          )}
        </form>
      )}

      {Array.isArray(comment.replies) &&
        comment.replies.map((reply) => (
          <CommentItem
            key={reply.id}
            comment={reply}
            depth={depth + 1}
            replyDrafts={replyDrafts}
            replyFiles={replyFiles}
            onReplyToggle={onReplyToggle}
            onReplyContentChange={onReplyContentChange}
            onReplyFileChange={onReplyFileChange}
            onReplyFileRemove={onReplyFileRemove}
            onReplySubmit={onReplySubmit}
            isAuthenticated={isAuthenticated}
            submittingReplyId={submittingReplyId}
          />
        ))}
    </div>
  );
};

const BoardDetailPage = () => {
  const { category, postId } = useParams();
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [post, setPost] = useState(null);
  const [postLoading, setPostLoading] = useState(true);
  const [comments, setComments] = useState([]);
  const [commentsLoading, setCommentsLoading] = useState(true);
  const [error, setError] = useState('');
  const [commentValue, setCommentValue] = useState('');
  const [commentImages, setCommentImages] = useState([]);
  const [replyDrafts, setReplyDrafts] = useState({});
  const [replyFiles, setReplyFiles] = useState({});
  const [submittingComment, setSubmittingComment] = useState(false);
  const [submittingReplyId, setSubmittingReplyId] = useState(null);

  const user = useMemo(() => getStoredUser(), []);
  const isAuthenticated = Boolean(sessionStorage.getItem('accessToken'));

  const fetchComments = async () => {
    if (!postId) return;

    setCommentsLoading(true);
    try {
      const response = await boardAPI.getComments(postId);
      setComments(response.data || []);
    } catch (fetchError) {
      console.error('댓글 로드 실패:', fetchError);
      setComments([]);
    } finally {
      setCommentsLoading(false);
    }
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await boardAPI.getCategories();
        setCategories(response.data || []);
      } catch (fetchError) {
        console.error('카테고리 로드 실패:', fetchError);
      } finally {
        setCategoriesLoading(false);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchPost = async () => {
      setPostLoading(true);
      setError('');

      try {
        const response = await boardAPI.getPost(postId);
        setPost(response.data);
      } catch (fetchError) {
        console.error('게시글 상세 조회 실패:', fetchError);
        setError('게시글을 불러오지 못했습니다. 잠시 후 다시 시도해주세요.');
      } finally {
        setPostLoading(false);
      }
    };

    if (postId) {
      fetchPost();
      fetchComments();
    }
  }, [postId]);

  const activeCategory = useMemo(() => {
    if (category) return category;
    if (post?.categoryKey) return post.categoryKey;
    return categories[0]?.categoryKey || 'board';
  }, [categories, category, post]);

  const currentCategory = categories.find((item) => item.categoryKey === activeCategory);
  const contentHtml = normalizePostContent(post);

  const imageAttachments = (post?.attachments || []).filter((item) => item.contentType?.startsWith('image/'));
  const fileAttachments = (post?.attachments || []).filter((item) => !item.contentType?.startsWith('image/'));

  const appendUniqueFiles = (previousFiles, nextFiles) => {
    const existingKeys = new Set(previousFiles.map((file) => `${file.name}-${file.size}-${file.lastModified}`));
    const additions = nextFiles.filter(
      (file) => !existingKeys.has(`${file.name}-${file.size}-${file.lastModified}`)
    );
    return [...previousFiles, ...additions];
  };

  const handleCommentImageChange = (event) => {
    const nextFiles = Array.from(event.target.files || []);
    setCommentImages((prev) => appendUniqueFiles(prev, nextFiles));
    event.target.value = '';
  };

  const handleReplyToggle = (commentId) => {
    setReplyDrafts((prev) => {
      if (prev[commentId] !== undefined) {
        const next = { ...prev };
        delete next[commentId];
        return next;
      }
      return { ...prev, [commentId]: '' };
    });

    setReplyFiles((prev) => {
      if (prev[commentId] !== undefined) {
        const next = { ...prev };
        delete next[commentId];
        return next;
      }
      return prev;
    });
  };

  const handleReplyContentChange = (commentId, value) => {
    setReplyDrafts((prev) => ({
      ...prev,
      [commentId]: value,
    }));
  };

  const handleReplyFileChange = (commentId, event) => {
    const nextFiles = Array.from(event.target.files || []);
    setReplyFiles((prev) => ({
      ...prev,
      [commentId]: appendUniqueFiles(prev[commentId] || [], nextFiles),
    }));
    event.target.value = '';
  };

  const handleReplyFileRemove = (commentId, targetFile) => {
    setReplyFiles((prev) => ({
      ...prev,
      [commentId]: (prev[commentId] || []).filter(
        (file) =>
          !(
            file.name === targetFile.name &&
            file.size === targetFile.size &&
            file.lastModified === targetFile.lastModified
          )
      ),
    }));
  };

  const submitComment = async ({ parentId = null, content, images = [] }) => {
    await boardAPI.createCommentFormData({
      postId,
      payload: {
        parentId,
        content: content.trim() || null,
      },
      images,
    });

    await fetchComments();
  };

  const handleCommentSubmit = async (event) => {
    event.preventDefault();

    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (!commentValue.trim() && commentImages.length === 0) {
      return;
    }

    setSubmittingComment(true);
    try {
      await submitComment({
        content: commentValue,
        images: commentImages,
      });
      setCommentValue('');
      setCommentImages([]);
    } catch (submitError) {
      console.error('댓글 작성 실패:', submitError);
      setError('댓글 등록에 실패했습니다.');
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleReplySubmit = async (event, commentId) => {
    event.preventDefault();

    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    const draft = replyDrafts[commentId] || '';
    const attachedFiles = replyFiles[commentId] || [];
    if (!draft.trim() && attachedFiles.length === 0) {
      return;
    }

    setSubmittingReplyId(commentId);
    try {
      await submitComment({
        parentId: commentId,
        content: draft,
        images: attachedFiles,
      });
      setReplyDrafts((prev) => {
        const next = { ...prev };
        delete next[commentId];
        return next;
      });
      setReplyFiles((prev) => {
        const next = { ...prev };
        delete next[commentId];
        return next;
      });
    } catch (submitError) {
      console.error('답글 작성 실패:', submitError);
      setError('답글 등록에 실패했습니다.');
    } finally {
      setSubmittingReplyId(null);
    }
  };

  if (categoriesLoading || postLoading) {
    return (
      <div className="board-page">
        <div className="board-loading">로딩 중...</div>
      </div>
    );
  }

  return (
    <div className="board-page">
      <nav className="board-nav">
        <div className="board-nav__container">
          <div className="board-nav__tabs">
            {categories.map((cat) => (
              <Link
                key={cat.categoryKey}
                to={`/board/${cat.categoryKey}`}
                className={`board-nav__tab ${activeCategory === cat.categoryKey ? 'board-nav__tab--active' : ''}`}
              >
                <span className={`board-nav__icon board-nav__icon--${cat.categoryKey}`}>
                  {cat.iconUrl ? (
                    <img src={cat.iconUrl} alt={cat.name} className="board-nav__icon-img" />
                  ) : (
                    cat.name.substring(0, 2).toUpperCase()
                  )}
                </span>
                <span className="board-nav__label">{cat.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </nav>

      <section className="board-detail">
        <div className="board-detail__container">
          <div className="board-detail__toolbar">
            <button className="board-detail__back" onClick={() => navigate(`/board/${activeCategory}`)}>
              목록으로
            </button>
            <Link className="board-detail__write" to={`/board/${activeCategory}/write`}>
              글쓰기
            </Link>
          </div>

          {error ? (
            <div className="board-detail__empty">{error}</div>
          ) : (
            <div className="board-detail__grid">
              <div className="board-detail__main">
                <article className="board-detail__article">
                  <div className="board-detail__article-head">
                    <div className="board-detail__badges">
                      {post?.notice && <span className="post-item__notice">공지</span>}
                      <span className={`post-item__type post-item__type--${post?.postType || 'free'}`}>
                        {postTypeLabels[post?.postType] || '게시글'}
                      </span>
                      {post?.tag && <span className="post-item__tag">{post.tag}</span>}
                    </div>
                    <p className="board-detail__eyebrow">{currentCategory?.name || post?.categoryName || '커뮤니티'}</p>
                    <h1 className="board-detail__title">{post?.title}</h1>
                    <div className="board-detail__meta">
                      <span>{post?.authorNickname || '작성자 없음'}</span>
                      <span>{formatDateTime(post?.createdAt)}</span>
                      <span>조회 {(post?.viewCount ?? 0).toLocaleString()}</span>
                      <span>좋아요 {post?.likeCount ?? 0}</span>
                      <span>댓글 {post?.replyCount ?? 0}</span>
                    </div>
                  </div>

                  <div className="board-detail__content" dangerouslySetInnerHTML={{ __html: contentHtml }} />

                  {(imageAttachments.length > 0 || fileAttachments.length > 0) && (
                    <div className="board-detail__attachments">
                      <div className="board-detail__attachments-head">
                        <h2>첨부파일</h2>
                        <span>{post?.attachments?.length || 0}개</span>
                      </div>

                      {imageAttachments.length > 0 && (
                        <div className="board-detail__image-grid">
                          {imageAttachments.map((attachment) => (
                            <a
                              key={attachment.id}
                              href={attachment.fileUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="board-detail__image-card"
                            >
                              <img src={attachment.fileUrl} alt={attachment.fileName} />
                              <span>{attachment.fileName}</span>
                            </a>
                          ))}
                        </div>
                      )}

                      {fileAttachments.length > 0 && (
                        <div className="board-detail__file-list">
                          {fileAttachments.map((attachment) => (
                            <a
                              key={attachment.id}
                              href={attachment.fileUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="board-detail__file-item"
                            >
                              <div>
                                <strong>{attachment.fileName}</strong>
                                <span>{attachment.contentType || 'file'} · {formatFileSize(attachment.fileSize)}</span>
                              </div>
                              <span>열기</span>
                            </a>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </article>

                <section className="board-comments">
                  <div className="board-comments__head">
                    <div>
                      <p className="board-detail__card-label">댓글</p>
                      <h2>댓글 {post?.replyCount ?? comments.length}개</h2>
                    </div>
                    {user?.nickname ? <span className="board-comments__user">{user.nickname} 님으로 작성</span> : null}
                  </div>

                  <form className="board-comments__form" onSubmit={handleCommentSubmit}>
                    <textarea
                      value={commentValue}
                      onChange={(event) => setCommentValue(event.target.value)}
                      placeholder={isAuthenticated ? '댓글을 입력해주세요.' : '댓글을 작성하려면 로그인해주세요.'}
                      rows={4}
                      disabled={!isAuthenticated || submittingComment}
                    />

                    <div className="board-comments__form-actions">
                      <label className="board-comment__file-picker">
                        이미지 첨부
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={handleCommentImageChange}
                          disabled={!isAuthenticated || submittingComment}
                        />
                      </label>
                      <button type="submit" disabled={!isAuthenticated || submittingComment}>
                        {submittingComment ? '등록 중...' : '댓글 등록'}
                      </button>
                    </div>

                    {commentImages.length > 0 && (
                      <div className="board-comment__draft-files">
                        {commentImages.map((file) => (
                          <button
                            key={`${file.name}-${file.lastModified}`}
                            type="button"
                            className="board-comment__draft-file"
                            onClick={() =>
                              setCommentImages((prev) =>
                                prev.filter(
                                  (item) =>
                                    !(
                                      item.name === file.name &&
                                      item.size === file.size &&
                                      item.lastModified === file.lastModified
                                    )
                                )
                              )
                            }
                          >
                            {file.name} ×
                          </button>
                        ))}
                      </div>
                    )}
                  </form>

                  {commentsLoading ? (
                    <div className="board-detail__empty">댓글을 불러오는 중입니다...</div>
                  ) : comments.length === 0 ? (
                    <div className="board-detail__empty">첫 댓글을 남겨보세요.</div>
                  ) : (
                    <div className="board-comments__list">
                      {comments.map((comment) => (
                        <CommentItem
                          key={comment.id}
                          comment={comment}
                          replyDrafts={replyDrafts}
                          replyFiles={replyFiles}
                          onReplyToggle={handleReplyToggle}
                          onReplyContentChange={handleReplyContentChange}
                          onReplyFileChange={handleReplyFileChange}
                          onReplyFileRemove={handleReplyFileRemove}
                          onReplySubmit={handleReplySubmit}
                          isAuthenticated={isAuthenticated}
                          submittingReplyId={submittingReplyId}
                        />
                      ))}
                    </div>
                  )}
                </section>
              </div>

              <aside className="board-detail__aside">
                <div className="board-detail__card">
                  <p className="board-detail__card-label">게시판 안내</p>
                  <h2 className="board-detail__card-title">{currentCategory?.name || '커뮤니티'}</h2>
                  <p className="board-detail__card-text">
                    {currentCategory?.summary || '게시글과 첨부파일, 댓글을 한곳에서 확인할 수 있습니다.'}
                  </p>
                </div>

                <div className="board-detail__card">
                  <p className="board-detail__card-label">요약 정보</p>
                  <dl className="board-detail__stats">
                    <div>
                      <dt>게시글 유형</dt>
                      <dd>{postTypeLabels[post?.postType] || '게시글'}</dd>
                    </div>
                    <div>
                      <dt>작성 시각</dt>
                      <dd>{formatDateTime(post?.createdAt)}</dd>
                    </div>
                    <div>
                      <dt>최종 수정</dt>
                      <dd>{formatDateTime(post?.updatedAt || post?.createdAt)}</dd>
                    </div>
                    <div>
                      <dt>첨부 수</dt>
                      <dd>{post?.attachments?.length || 0}</dd>
                    </div>
                  </dl>
                </div>
              </aside>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default BoardDetailPage;
