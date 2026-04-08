import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { boardAPI } from '../api/boardAPI';
import '../styles/pages/BoardPage.css';

const BoardPage = () => {
  const { category } = useParams();
  const navigate = useNavigate();
  
  // 카테고리 상태
  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  
  // 게시글 상태
  const [posts, setPosts] = useState([]);
  const [postsLoading, setPostsLoading] = useState(true);
  const [postTypeFilter, setPostTypeFilter] = useState('all');
  
  // 페이지네이션 상태
  const [pagination, setPagination] = useState({
    page: 0,
    size: 20,
    totalElements: 0,
    totalPages: 0,
    hasNext: false,
  });

  const postTypeLabels = {
    all: '전체',
    free: '자유글',
    info: '정보글',
  };

  // 카테고리 로드
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await boardAPI.getCategories();
        setCategories(response.data);
      } catch (error) {
        console.error('카테고리 로드 실패:', error);
      } finally {
        setCategoriesLoading(false);
      }
    };
    fetchCategories();
  }, []);

  // 현재 활성 카테고리 결정
  const activeCategory = category || (categories.length > 0 ? categories[0]?.categoryKey : 'lol');
  const currentCategory = categories.find(c => c.categoryKey === activeCategory);

  // 게시글 로드
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
        
        setPosts(response.data.items || []);
        setPagination(prev => ({
          ...prev,
          totalElements: response.data.totalElements,
          totalPages: response.data.totalPages,
          hasNext: response.data.hasNext,
        }));
      } catch (error) {
        console.error('게시글 로드 실패:', error);
        setPosts([]);
      } finally {
        setPostsLoading(false);
      }
    };
    
    fetchPosts();
  }, [activeCategory, postTypeFilter, pagination.page, pagination.size]);

  // 카테고리 변경 시 필터/페이지 초기화
  const handleCategoryChange = (categoryKey) => {
    setPostTypeFilter('all');
    setPagination(prev => ({ ...prev, page: 0 }));
    navigate(`/board/${categoryKey}`);
  };

  // 필터 변경
  const handleFilterChange = (type) => {
    setPostTypeFilter(type);
    setPagination(prev => ({ ...prev, page: 0 }));
  };

  // 페이지 변경
  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < pagination.totalPages) {
      setPagination(prev => ({ ...prev, page: newPage }));
    }
  };

  // 날짜 포맷
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR');
  };

  // 페이지 버튼 생성
  const renderPaginationButtons = () => {
    const buttons = [];
    const { page, totalPages } = pagination;
    
    // 이전 버튼
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
    
    // 페이지 번호 (최대 5개)
    const startPage = Math.max(0, page - 2);
    const endPage = Math.min(totalPages, startPage + 5);
    
    for (let i = startPage; i < endPage; i++) {
      buttons.push(
        <button
          key={i}
          className={`board-pagination__btn ${page === i ? 'board-pagination__btn--active' : ''}`}
          onClick={() => handlePageChange(i)}
        >
          {i + 1}
        </button>
      );
    }
    
    // 다음 버튼
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
      {/* Category Nav */}
      <nav className="board-nav">
        <div className="board-nav__container">
          <div className="board-nav__tabs">
            {categories.map((cat) => (
              <Link
                key={cat.categoryKey}
                to={`/board/${cat.categoryKey}`}
                className={`board-nav__tab ${activeCategory === cat.categoryKey ? 'board-nav__tab--active' : ''}`}
                onClick={(e) => {
                  e.preventDefault();
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

      {/* Posts Section */}
      <section className="board-posts">
        <div className="board-posts__container">
          <div className="board-posts__header">
            <div>
              <h1 className="board-posts__title">{currentCategory?.name || ''} 게시판</h1>
              <p className="board-posts__subtitle">{currentCategory?.summary || ''}</p>
            </div>
            <span className="board-posts__count">{pagination.totalElements} posts</span>
          </div>

          {/* Post Type Filter */}
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
            <button className="board-filter__write-btn">새 글 작성</button>
          </div>

          <div className="board-posts__list">
            {postsLoading ? (
              <div className="board-posts__empty">로딩 중...</div>
            ) : posts.length === 0 ? (
              <div className="board-posts__empty">작성된 게시물이 없습니다</div>
            ) : (
              posts.map((post) => (
                <article key={post.id} className="post-item">
                  <div className="post-item__inner">
                    <div>
                      <div className="post-item__meta">
                        {post.notice && <span className="post-item__notice">공지</span>}
                        <span className={`post-item__type post-item__type--${post.postType}`}>
                          {post.postType === 'info' ? '정보' : '자유'}
                        </span>
                        {post.tag && <span className="post-item__tag">{post.tag}</span>}
                        <span className="post-item__date">{formatDate(post.createdAt)}</span>
                      </div>
                      <h3 className="post-item__title">{post.title}</h3>
                      <p className="post-item__info">
                        {post.authorNickname} · 조회 {post.viewCount.toLocaleString()} · 댓글 {post.replyCount}
                      </p>
                    </div>
                    <Link to={`/board/post/${post.id}`} className="post-item__read-btn">읽기</Link>
                  </div>
                </article>
              ))
            )}
          </div>

          {pagination.totalPages > 0 && (
            <div className="board-pagination">
              {renderPaginationButtons()}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default BoardPage;
