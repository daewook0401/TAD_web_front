import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
    { id: 1, date: '2026-04-10 20:30', game: 'League of Legends', result: '승리', kda: '12/2/8', gold: '16.6K', player: 'Ahri' },
    { id: 2, date: '2026-04-08 21:10', game: 'League of Legends', result: '패배', kda: '5/4/9', gold: '13.2K', player: 'Lissandra' },
    { id: 3, date: '2026-04-07 19:40', game: 'League of Legends', result: '승리', kda: '7/1/13', gold: '14.1K', player: 'Orianna' },
  ];

  const filteredMatches = filterGame === 'all' ? matches : matches.filter((match) => match.game === filterGame);
  const wins = matches.filter((match) => match.result === '승리').length;
  const losses = matches.filter((match) => match.result === '패배').length;

  return (
    <div className="matches-page">
      <section className="matches-hero">
        <div className="matches-hero__container matches-hero__container--split">
          <div>
            <span className="matches-hero__eyebrow">My Match Log</span>
            <h1 className="matches-hero__title">내 전적 확인</h1>
            <p className="matches-hero__description">
              최근 내전 기록과 결과를 한 번에 확인하고, 새 경기 결과도 바로 등록할 수 있습니다.
            </p>
            <Link to="/matches/upload" className="match-upload__cta">
              내전 기록 등록
            </Link>
          </div>
          <div className="matches-hero__user">
            <p className="matches-hero__user-label">소환사</p>
            <p className="matches-hero__user-name">{user?.nickname || '사용자'}</p>
          </div>
        </div>
      </section>

      <section className="my-stats">
        <div className="my-stats__grid">
          <div className="my-stats__card">
            <p className="my-stats__label">총 경기</p>
            <p className="my-stats__value">{matches.length}</p>
          </div>
          <div className="my-stats__card">
            <p className="my-stats__label">승리</p>
            <p className="my-stats__value my-stats__value--win">{wins}</p>
          </div>
          <div className="my-stats__card">
            <p className="my-stats__label">패배</p>
            <p className="my-stats__value my-stats__value--loss">{losses}</p>
          </div>
          <div className="my-stats__card">
            <p className="my-stats__label">승률</p>
            <p className="my-stats__value">{Math.round((wins / matches.length) * 100)}%</p>
          </div>
          <div className="my-stats__card">
            <p className="my-stats__label">평균 KDA</p>
            <p className="my-stats__value">8.0</p>
          </div>
        </div>
      </section>

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
        </div>
      </section>

      <section className="matches-table">
        <div className="matches-table__container">
          <div className="matches-table__wrapper">
            <table className="matches-table__table">
              <thead>
                <tr className="matches-table__header-row">
                  <th className="matches-table__th">날짜</th>
                  <th className="matches-table__th">게임</th>
                  <th className="matches-table__th">결과</th>
                  <th className="matches-table__th">플레이어</th>
                  <th className="matches-table__th">K / D / A</th>
                  <th className="matches-table__th">Gold</th>
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
                      <td className="matches-table__td matches-table__td--name">{match.player}</td>
                      <td className="matches-table__td matches-table__td--kda">{match.kda}</td>
                      <td className="matches-table__td">{match.gold}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="matches-table__empty">
                      표시할 경기 기록이 없습니다.
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
