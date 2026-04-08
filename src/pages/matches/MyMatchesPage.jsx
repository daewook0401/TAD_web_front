import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../provider/AuthContext';
import '../../styles/pages/MatchesPages.css';

const MyMatchesPage = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [filterGame, setFilterGame] = useState('all');

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) {
    return null;
  }

  const matches = [
    { id: 1, date: '2025-12-06 14:30', game: 'League of Legends', result: '승리', kda: '12/2/8', duration: '35분', champion: 'Ahri', tier: 'Gold' },
    { id: 2, date: '2025-12-06 13:45', game: 'League of Legends', result: '패배', kda: '8/5/6', duration: '28분', champion: 'Lux', tier: 'Silver' },
    { id: 3, date: '2025-12-05 20:15', game: 'Mapleland', result: '승리', kda: '15/1/10', duration: '42분', champion: 'Warrior', tier: 'Platinum' },
    { id: 4, date: '2025-12-05 19:20', game: 'League of Legends', result: '승리', kda: '10/3/9', duration: '31분', champion: 'Evelynn', tier: 'Gold' },
    { id: 5, date: '2025-12-04 18:45', game: 'Mapleland', result: '패배', kda: '7/8/5', duration: '25분', champion: 'Archer', tier: 'Silver' },
    { id: 6, date: '2025-12-04 17:30', game: 'League of Legends', result: '승리', kda: '14/4/7', duration: '36분', champion: 'Syndra', tier: 'Gold' },
  ];

  const filteredMatches = filterGame === 'all' ? matches : matches.filter(m => m.game === filterGame);

  const stats = {
    totalMatches: matches.length,
    wins: matches.filter(m => m.result === '승리').length,
    losses: matches.filter(m => m.result === '패배').length,
    winRate: Math.round((matches.filter(m => m.result === '승리').length / matches.length) * 100),
    avgKda: '10.3',
  };

  return (
    <div className="matches-page">
      {/* Hero Section */}
      <section className="matches-hero">
        <div className="matches-hero__container matches-hero__container--split">
          <div>
            <span className="matches-hero__eyebrow">My Match Log</span>
            <h1 className="matches-hero__title">내 전적 확인</h1>
            <p className="matches-hero__description">최근 경기 흐름과 핵심 지표를 한 번에 확인하세요.</p>
          </div>
          {isAuthenticated && (
            <div className="matches-hero__user">
              <p className="matches-hero__user-label">사용자</p>
              <p className="matches-hero__user-name">{user?.name || '사용자'}</p>
            </div>
          )}
        </div>
      </section>

      {/* Stats Cards */}
      <section className="my-stats">
        <div className="my-stats__grid">
          <div className="my-stats__card">
            <p className="my-stats__label">총 경기</p>
            <p className="my-stats__value">{stats.totalMatches}</p>
          </div>
          <div className="my-stats__card">
            <p className="my-stats__label">승리</p>
            <p className="my-stats__value my-stats__value--win">{stats.wins}</p>
          </div>
          <div className="my-stats__card">
            <p className="my-stats__label">패배</p>
            <p className="my-stats__value my-stats__value--loss">{stats.losses}</p>
          </div>
          <div className="my-stats__card">
            <p className="my-stats__label">승률</p>
            <p className="my-stats__value">{stats.winRate}%</p>
          </div>
          <div className="my-stats__card">
            <p className="my-stats__label">평균 K/D/A</p>
            <p className="my-stats__value">{stats.avgKda}</p>
          </div>
        </div>
      </section>

      {/* Filter Section */}
      <section className="matches-filter">
        <div className="matches-filter__container">
          <span className="matches-filter__label">게임 필터:</span>
          <button
            onClick={() => setFilterGame('all')}
            className={`matches-filter__btn ${filterGame === 'all' ? 'matches-filter__btn--active' : ''}`}
          >
            전체
          </button>
          <button
            onClick={() => setFilterGame('League of Legends')}
            className={`matches-filter__btn ${filterGame === 'League of Legends' ? 'matches-filter__btn--active' : ''}`}
          >
            League of Legends
          </button>
          <button
            onClick={() => setFilterGame('Mapleland')}
            className={`matches-filter__btn ${filterGame === 'Mapleland' ? 'matches-filter__btn--active' : ''}`}
          >
            Mapleland
          </button>
        </div>
      </section>

      {/* Matches Table */}
      <section className="matches-table">
        <div className="matches-table__container">
          <div className="matches-table__wrapper">
            <table className="matches-table__table">
              <thead>
                <tr className="matches-table__header-row">
                  <th className="matches-table__th">날짜</th>
                  <th className="matches-table__th">게임</th>
                  <th className="matches-table__th">결과</th>
                  <th className="matches-table__th">챔피언/직업</th>
                  <th className="matches-table__th">K/D/A</th>
                  <th className="matches-table__th">게임시간</th>
                  <th className="matches-table__th">티어</th>
                </tr>
              </thead>
              <tbody>
                {filteredMatches.length > 0 ? (
                  filteredMatches.map((match) => (
                    <tr key={match.id} className="matches-table__row">
                      <td className="matches-table__td">{match.date}</td>
                      <td className="matches-table__td">{match.game}</td>
                      <td className="matches-table__td">
                        <span className={`matches-table__result ${match.result === '승리' ? 'matches-table__result--win' : 'matches-table__result--loss'}`}>
                          {match.result}
                        </span>
                      </td>
                      <td className="matches-table__td">{match.champion}</td>
                      <td className="matches-table__td matches-table__td--kda">{match.kda}</td>
                      <td className="matches-table__td">{match.duration}</td>
                      <td className="matches-table__td">
                        <span className="matches-table__tier">{match.tier}</span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="matches-table__empty">
                      경기 기록이 없습니다
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
};

export default MyMatchesPage;
