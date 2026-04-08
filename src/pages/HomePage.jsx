import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/pages/HomePage.css';

const HomePage = () => {
  const summaryCards = [
    { label: '기록된 내전', value: '1,248', description: '팀 단위 경기 데이터' },
    { label: '활성 플레이어', value: '320+', description: '최근 30일 기준' },
    { label: '평균 분석 시간', value: '3초', description: '검색부터 결과까지' },
  ];

  const featureCards = [
    {
      title: '내전 전적 관리',
      description: '승패, KDA, 게임 시간까지 한 화면에서 정리해 팀 흐름을 빠르게 확인합니다.',
    },
    {
      title: '카테고리 커뮤니티',
      description: '롤, 메이플랜드, 자유 게시판을 나눠 정보와 이야기가 섞이지 않게 구성했습니다.',
    },
    {
      title: '랭킹과 검색',
      description: '플레이어별 기록과 팀 랭킹을 이어서 확인할 수 있는 전적 허브를 지향합니다.',
    },
  ];

  const matchesData = [
    { id: 1, date: '2025-12-06', game: 'League of Legends', result: '승리', kda: '12/2/8', duration: '35분' },
    { id: 2, date: '2025-12-05', game: 'League of Legends', result: '패배', kda: '8/5/6', duration: '28분' },
    { id: 3, date: '2025-12-05', game: 'Mapleland', result: '승리', kda: '15/1/10', duration: '42분' },
    { id: 4, date: '2025-12-04', game: 'League of Legends', result: '승리', kda: '10/3/9', duration: '31분' },
    { id: 5, date: '2025-12-04', game: 'Mapleland', result: '패배', kda: '7/8/5', duration: '25분' },
  ];

  const infoData = [
    { id: 1, category: 'League of Legends', title: '새로운 챔피언 공략', author: '게임마스터', views: 1523, date: '2025-12-06' },
    { id: 2, category: 'League of Legends', title: '시즌 9 메타 분석', author: '프로게이머', views: 2341, date: '2025-12-05' },
    { id: 3, category: 'Mapleland', title: '효율적인 레벨링 팁', author: '시스템운영자', views: 892, date: '2025-12-04' },
    { id: 4, category: 'League of Legends', title: '랭크 올리는 법', author: '경험자', views: 3456, date: '2025-12-03' },
    { id: 5, category: 'Mapleland', title: '보스 레이드 가이드', author: '길드마스터', views: 1205, date: '2025-12-02' },
  ];

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero__background" />
        <div className="hero__container">
          <div className="hero__content">
            <div className="hero__badge">
              내전 기록, 커뮤니티, 랭킹을 한 번에
            </div>

            <h1 className="hero__title">
              게임 기록을 더 보기 좋게,
              <span className="hero__title-accent">TAD에서 정리하세요.</span>
            </h1>
            <p className="hero__description">
              흩어진 내전 기록과 게임 정보를 깔끔한 대시보드로 모았습니다. 지금은 보여주는 힘에 집중한, 가볍고 세련된 게임 허브입니다.
            </p>

            <div className="hero__actions">
              <Link to="/matches/search" className="hero__btn-primary">
                전적 둘러보기
              </Link>
              <Link to="/board/lol" className="hero__btn-secondary">
                커뮤니티 보기
              </Link>
            </div>

            <div className="hero__stats">
              {summaryCards.map((card) => (
                <div key={card.label} className="hero__stat">
                  <p className="hero__stat-label">{card.label}</p>
                  <p className="hero__stat-value">{card.value}</p>
                  <p className="hero__stat-desc">{card.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="hero__preview">
            <div className="hero__preview-card">
              <div className="hero__preview-header">
                <div>
                  <p className="hero__preview-title">Live Preview</p>
                  <h2 className="hero__preview-subtitle">오늘의 전적 흐름</h2>
                </div>
                <span className="hero__preview-badge">Demo</span>
              </div>

              <div className="hero__preview-list">
                {matchesData.slice(0, 3).map((match) => (
                  <div key={match.id} className="match-item">
                    <div className="match-item__info">
                      <p className="match-item__game">{match.game}</p>
                      <p className="match-item__meta">{match.date} · {match.duration}</p>
                    </div>
                    <span className={`match-item__result ${match.result === '승리' ? 'match-item__result--win' : 'match-item__result--lose'}`}>
                      {match.result}
                    </span>
                    <div className="match-item__kda">
                      <p className="match-item__kda-label">KDA</p>
                      <p className="match-item__kda-value">{match.kda}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <div className="features__container">
          <div className="features__grid">
            {featureCards.map((feature) => (
              <div key={feature.title} className="feature-card">
                <div className="feature-card__icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                  </svg>
                </div>
                <h3 className="feature-card__title">{feature.title}</h3>
                <p className="feature-card__description">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tables Section */}
      <section className="tables-section">
        <div className="tables-section__container">
          {/* Matches Table */}
          <div className="table-card">
            <div className="table-card__header">
              <div>
                <h2 className="table-card__title">최근 내전 전적</h2>
                <p className="table-card__subtitle">승패와 KDA를 한눈에 훑어보세요.</p>
              </div>
              <Link to="/matches/my" className="table-card__link">
                전체보기
              </Link>
            </div>

            <div className="table-card__body">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>날짜</th>
                    <th>게임</th>
                    <th>결과</th>
                    <th>K/D/A</th>
                    <th>게임시간</th>
                  </tr>
                </thead>
                <tbody>
                  {matchesData.map((match) => (
                    <tr key={match.id}>
                      <td>{match.date}</td>
                      <td>{match.game}</td>
                      <td>
                        <span className={`match-item__result ${match.result === '승리' ? 'match-item__result--win' : 'match-item__result--lose'}`}>
                          {match.result}
                        </span>
                      </td>
                      <td>{match.kda}</td>
                      <td>{match.duration}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Info Table */}
          <div className="table-card">
            <div className="table-card__header">
              <div>
                <h2 className="table-card__title">최신 정보 글</h2>
                <p className="table-card__subtitle">게임별 업데이트와 팁을 빠르게 확인하세요.</p>
              </div>
              <Link to="/info" className="table-card__link">
                전체보기
              </Link>
            </div>

            <div className="table-card__body">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>카테고리</th>
                    <th>제목</th>
                    <th>작성자</th>
                    <th>조회수</th>
                    <th>날짜</th>
                  </tr>
                </thead>
                <tbody>
                  {infoData.map((article) => (
                    <tr key={article.id}>
                      <td>
                        <span className={`data-table__category ${article.category === 'League of Legends' ? 'data-table__category--lol' : 'data-table__category--maple'}`}>
                          {article.category === 'League of Legends' ? 'LoL' : 'Maple'}
                        </span>
                      </td>
                      <td>{article.title}</td>
                      <td>{article.author}</td>
                      <td>{article.views.toLocaleString()}</td>
                      <td>{article.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
