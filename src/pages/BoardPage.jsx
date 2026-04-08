import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import '../styles/pages/BoardPage.css';

const BoardPage = () => {
  const { category } = useParams();
  const [postTypeFilter, setPostTypeFilter] = useState('all'); // all, free, info

  const categories = {
    lol: { name: '롤', icon: 'LOL', color: 'lol', summary: '메타, 챔피언, 내전 전략' },
    maple: { name: '메이플랜드', icon: 'ML', color: 'maple', summary: '사냥터, 보스, 육성 루트' },
    free: { name: '자유', icon: 'FR', color: 'free', summary: '잡담, 모집, 자유 주제' },
  };

  const postTypeLabels = {
    all: '전체',
    free: '자유글',
    info: '정보글',
  };

  const activeCategory = category && categories[category] ? category : 'lol';
  const currentCategory = categories[activeCategory];

  // 샘플 게시물 데이터 (postType 추가: free/info)
  const posts = [
    {
      id: 1,
      title: '최고의 초반 전략 공유합니다',
      author: '게임마스터',
      date: '2025-12-06',
      views: 342,
      replies: 28,
      category: 'lol',
      postType: 'free',
      tag: '전략',
    },
    {
      id: 2,
      title: '롤 패치 14.24 핵심 변경점 정리',
      author: '패치봇',
      date: '2025-12-05',
      views: 891,
      replies: 52,
      category: 'lol',
      postType: 'info',
      tag: '패치노트',
    },
    {
      id: 3,
      title: '오늘 저녁 내전 파티 구합니다',
      author: '내전러',
      date: '2025-12-05',
      views: 156,
      replies: 12,
      category: 'lol',
      postType: 'free',
      tag: '모집',
    },
    {
      id: 4,
      title: '시즌15 티어별 추천 챔피언 가이드',
      author: '공략왕',
      date: '2025-12-04',
      views: 1205,
      replies: 87,
      category: 'lol',
      postType: 'info',
      tag: '가이드',
    },
    {
      id: 5,
      title: '메이플랜드 파티 구해요',
      author: '관리자',
      date: '2025-12-05',
      views: 512,
      replies: 45,
      category: 'maple',
      postType: 'free',
      tag: '모집',
    },
    {
      id: 6,
      title: '메이플랜드 사냥터 추천 루트',
      author: '정보통',
      date: '2025-12-04',
      views: 678,
      replies: 33,
      category: 'maple',
      postType: 'info',
      tag: '가이드',
    },
    {
      id: 7,
      title: '요즘 재밌는 게임 추천해주세요',
      author: '게임덕후',
      date: '2025-12-04',
      views: 289,
      replies: 15,
      category: 'free',
      postType: 'free',
      tag: '잡담',
    },
    {
      id: 8,
      title: '게임 녹화 프로그램 비교 정리',
      author: '테크가이',
      date: '2025-12-03',
      views: 445,
      replies: 21,
      category: 'free',
      postType: 'info',
      tag: '팁',
    },
  ];

  // 카테고리 + 글 타입 필터링
  const filteredPosts = posts.filter((post) => {
    const categoryMatch = post.category === activeCategory;
    const typeMatch = postTypeFilter === 'all' || post.postType === postTypeFilter;
    return categoryMatch && typeMatch;
  });

  return (
    <div className="board-page">
      {/* Category Nav - 헤더 바로 아래 */}
      <nav className="board-nav">
        <div className="board-nav__container">
          <div className="board-nav__tabs">
            {Object.entries(categories).map(([categoryKey, categoryItem]) => (
              <Link
                key={categoryKey}
                to={`/board/${categoryKey}`}
                className={`board-nav__tab ${activeCategory === categoryKey ? 'board-nav__tab--active' : ''}`}
                onClick={() => setPostTypeFilter('all')}
              >
                <span className={`board-nav__icon board-nav__icon--${categoryItem.color}`}>
                  {categoryItem.icon}
                </span>
                <span className="board-nav__label">{categoryItem.name}</span>
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
              <h1 className="board-posts__title">{currentCategory.name} 게시판</h1>
              <p className="board-posts__subtitle">{currentCategory.summary}</p>
            </div>
            <span className="board-posts__count">{filteredPosts.length} posts</span>
          </div>

          {/* Post Type Filter */}
          <div className="board-filter-row">
            <div className="board-filter">
              {Object.entries(postTypeLabels).map(([typeKey, label]) => (
                <button
                  key={typeKey}
                  className={`board-filter__btn ${postTypeFilter === typeKey ? 'board-filter__btn--active' : ''}`}
                  onClick={() => setPostTypeFilter(typeKey)}
                >
                  {label}
                </button>
              ))}
            </div>
            <button className="board-filter__write-btn">새 글 작성</button>
          </div>

          <div className="board-posts__list">
            {filteredPosts.length === 0 ? (
              <div className="board-posts__empty">작성된 게시물이 없습니다</div>
            ) : (
              filteredPosts.map((post) => (
                <article key={post.id} className="post-item">
                  <div className="post-item__inner">
                    <div>
                      <div className="post-item__meta">
                        <span className={`post-item__type post-item__type--${post.postType}`}>
                          {post.postType === 'info' ? '정보' : '자유'}
                        </span>
                        <span className="post-item__tag">{post.tag}</span>
                        <span className="post-item__date">{post.date}</span>
                      </div>
                      <h3 className="post-item__title">{post.title}</h3>
                      <p className="post-item__info">
                        {post.author} · 조회 {post.views.toLocaleString()} · 댓글 {post.replies}
                      </p>
                    </div>
                    <span className="post-item__read-btn">읽기</span>
                  </div>
                </article>
              ))
            )}
          </div>

          <div className="board-pagination">
            {['이전', '1', '2', '3', '다음'].map((label) => (
              <button
                key={label}
                className={`board-pagination__btn ${label === '1' ? 'board-pagination__btn--active' : ''}`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default BoardPage;
