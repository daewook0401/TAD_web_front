import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { boardAPI } from '../api/boardAPI';
import '../styles/pages/BoardPage.css';

const postTypeLabels = {
  all: '전체',
  free: '자유글',
  info: '정보글',
};

const formatDate = (dateString) => {
  if (!dateString) return '-';

  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) {
    return '-';
  }

  return date.toLocaleDateString('ko-KR');
};

const BoardPage = () => {
  const { category } = useParams();
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [posts, setPosts] = useState([]);
  const [postsLoading, setPostsLoading] = useState(true);
  const [postTypeFilter, setPostTypeFilter] = useState('all');
  const [pagination, setPagination] = useState({
    page: 0,
    size: 20,
    totalElements: 0,
    totalPages: 0,
    hasNext: false,
  });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await boardAPI.getCategories();
        setCategories(response.data || []);
      } catch (error) {
        console.error('카테고리 로드 실패:', error);
      } finally {
        setCategoriesLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const activeCategory = useMemo(() => {
    if (category) return category;
    return categories[0]?.categoryKey || '';
  }, [categories, category]);

  const currentCategory = categories.find((item) => item.categoryKey === activeCategory);

  useEffect(() => {
    const fetchPosts = async () => {
      if (!activeCategory) return;

      setPostsLoading(true);
      try {
        const response = await boardAPI.getPosts({
          categoryKey: activeCategory,
          postType: postTypeFilter,
          page: pagination.page,
          size: pagination.size,
        });

        setPosts(response.data?.items || []);
        setPagination((prev) => ({
          ...prev,
          totalElements: response.data?.totalElements || 0,
          totalPages: response.data?.totalPages || 0,
          hasNext: response.data?.hasNext || false,
        }));
      } catch (error) {
        console.error('게시글 로드 실패:', error);
        setPosts([]);
      } finally {
        setPostsLoading(false);
      }
    };

    fetchPosts();
  }, [activeCategory, pagination.page, pagination.size, postTypeFilter]);

  const handleCategoryChange = (categoryKey) => {
    setPostTypeFilter('all');
    setPagination((prev) => ({ ...prev, page: 0 }));
    navigate(`/board/${categoryKey}`);
  };

  const handleFilterChange = (type) => {
    setPostTypeFilter(type);
    setPagination((prev) => ({ ...prev, page: 0 }));
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < pagination.totalPages) {
      setPagination((prev) => ({ ...prev, page: newPage }));
    }
  };

  const renderPaginationButtons = () => {
    const buttons = [];
    const { page, totalPages } = pagination;

    buttons.push(
      <button
        key="prev"
        className="board-pagination__btn"
        onClick={() => handlePageChange(page - 1)}
        disabled={page === 0}
      >
        이전
      </button>
    );

    const startPage = Math.max(0, page - 2);
    const endPage = Math.min(totalPages, startPage + 5);

    for (let index = startPage; index < endPage; index += 1) {
      buttons.push(
        <button
          key={index}
          className={`board-pagination__btn ${page === index ? 'board-pagination__btn--active' : ''}`}
          onClick={() => handlePageChange(index)}
        >
          {index + 1}
        </button>
      );
    }

    buttons.push(
      <button
        key="next"
        className="board-pagination__btn"
        onClick={() => handlePageChange(page + 1)}
        disabled={!pagination.hasNext}
      >
        다음
      </button>
    );

    return buttons;
  };

  if (categoriesLoading) {
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
                onClick={(event) => {
                  event.preventDefault();
                  handleCategoryChange(cat.categoryKey);
                }}
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

      <section className="board-posts">
        <div className="board-posts__container">
          <div className="board-posts__header">
            <div>
              <h1 className="board-posts__title">{currentCategory?.name || '게시판'}</h1>
              <p className="board-posts__subtitle">{currentCategory?.summary || '카테고리별 게시글을 확인해보세요.'}</p>
            </div>
            <span className="board-posts__count">총 {pagination.totalElements}개</span>
          </div>

          <div className="board-filter-row">
            <div className="board-filter">
              {Object.entries(postTypeLabels).map(([typeKey, label]) => (
                <button
                  key={typeKey}
                  className={`board-filter__btn ${postTypeFilter === typeKey ? 'board-filter__btn--active' : ''}`}
                  onClick={() => handleFilterChange(typeKey)}
                >
                  {label}
                </button>
              ))}
            </div>
            <button className="board-filter__write-btn" onClick={() => navigate(`/board/${activeCategory}/write`)}>
              글쓰기
            </button>
          </div>

          <div className="board-posts__list">
            {postsLoading ? (
              <div className="board-posts__empty">로딩 중...</div>
            ) : posts.length === 0 ? (
              <div className="board-posts__empty">아직 등록된 게시글이 없습니다.</div>
            ) : (
              posts.map((post) => (
                <article key={post.id} className="post-item">
                  <div className="post-item__inner">
                    <div>
                      <div className="post-item__meta">
                        {post.notice && <span className="post-item__notice">공지</span>}
                        <span className={`post-item__type post-item__type--${post.postType}`}>
                          {postTypeLabels[post.postType] || '게시글'}
                        </span>
                        {post.tag && <span className="post-item__tag">{post.tag}</span>}
                        <span className="post-item__date">{formatDate(post.createdAt)}</span>
                      </div>
                      <h3 className="post-item__title">{post.title}</h3>
                      <p className="post-item__info">
                        {post.authorNickname || '익명'} · 조회 {(post.viewCount ?? 0).toLocaleString()} · 댓글{' '}
                        {post.replyCount ?? 0}
                      </p>
                    </div>
                    <Link to={`/board/${post.categoryKey || activeCategory}/post/${post.id}`} className="post-item__read-btn">
                      보기
                    </Link>
                  </div>
                </article>
              ))
            )}
          </div>

          {pagination.totalPages > 0 && <div className="board-pagination">{renderPaginationButtons()}</div>}
        </div>
      </section>
    </div>
  );
};

export default BoardPage;
