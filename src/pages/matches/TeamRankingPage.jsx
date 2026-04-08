import React, { useState } from 'react';
import '../../styles/pages/MatchesPages.css';

const UserRankingPage = () => {
  const [filterRank, setFilterRank] = useState('all');

  const users = [
    { rank: 1, name: '김태희', rolNickname: 'Faker', tier: 'S', rating: 2950, wins: 234, losses: 89, winRate: 72 },
    { rank: 2, name: '이상혁', rolNickname: 'Khan', tier: 'S', rating: 2880, wins: 198, losses: 76, winRate: 72 },
    { rank: 3, name: '박상호', rolNickname: 'ShowMaker', tier: 'S', rating: 2820, wins: 187, losses: 82, winRate: 70 },
    { rank: 4, name: '정지훈', rolNickname: 'Canyon', tier: 'A+', rating: 2750, wins: 176, losses: 89, winRate: 66 },
    { rank: 5, name: '조석민', rolNickname: 'Gumayusi', tier: 'A+', rating: 2680, wins: 164, losses: 95, winRate: 63 },
    { rank: 6, name: '강나', rolNickname: 'Keria', tier: 'A', rating: 2610, wins: 152, losses: 108, winRate: 59 },
    { rank: 7, name: '이준호', rolNickname: 'Viper', tier: 'A', rating: 2540, wins: 189, losses: 124, winRate: 60 },
    { rank: 8, name: '이형석', rolNickname: 'Deft', tier: 'A', rating: 2470, wins: 176, losses: 132, winRate: 57 },
    { rank: 9, name: '박준영', rolNickname: 'Peanut', tier: 'B+', rating: 2400, wins: 145, losses: 156, winRate: 48 },
    { rank: 10, name: '최지훈', rolNickname: 'Impact', tier: 'B+', rating: 2330, wins: 132, losses: 178, winRate: 43 },
    { rank: 11, name: '오충완', rolNickname: 'Flame', tier: 'B', rating: 2260, wins: 118, losses: 195, winRate: 38 },
    { rank: 12, name: '정민준', rolNickname: 'Ssumday', tier: 'B', rating: 2190, wins: 105, losses: 210, winRate: 33 },
  ];

  const filteredUsers = filterRank === 'all' ? users : users.filter(u => u.tier === filterRank);

  const getTierClass = (tier) => {
    const tierMap = { 'S': 'tier-s', 'A+': 'tier-a-plus', 'A': 'tier-a', 'B+': 'tier-b-plus', 'B': 'tier-b', 'C': 'tier-c', 'D': 'tier-d' };
    return tierMap[tier] || '';
  };

  return (
    <div className="matches-page">
      {/* Hero Section */}
      <section className="matches-hero">
        <div className="matches-hero__container">
          <span className="matches-hero__eyebrow">Ranking Board</span>
          <h1 className="matches-hero__title">유저 등급</h1>
          <p className="matches-hero__description">내전 기록 기반의 플레이어 등급과 승률을 비교하세요.</p>
        </div>
      </section>

      {/* Filter Section */}
      <section className="matches-filter">
        <div className="matches-filter__container">
          <span className="matches-filter__label">등급 필터:</span>
          <button
            onClick={() => setFilterRank('all')}
            className={`matches-filter__btn ${filterRank === 'all' ? 'matches-filter__btn--active' : ''}`}
          >
            전체
          </button>
          {['S', 'A+', 'A', 'B+', 'B', 'C', 'D'].map((tier) => (
            <button
              key={tier}
              onClick={() => setFilterRank(tier)}
              className={`matches-filter__btn ${filterRank === tier ? 'matches-filter__btn--active' : ''}`}
            >
              {tier}
            </button>
          ))}
        </div>
      </section>

      {/* Top 3 Podium */}
      <section className="ranking-podium">
        <div className="ranking-podium__container">
          <h2 className="ranking-podium__title">상위 유저</h2>
          <div className="ranking-podium__grid">
            {filteredUsers.slice(0, 3).map((user, index) => (
              <div key={user.rank} className={`ranking-podium__card ranking-podium__card--${index + 1}`}>
                <div className="ranking-podium__inner">
                  <div className={`ranking-podium__rank ranking-podium__rank--${index + 1}`}>
                    #{user.rank}
                  </div>
                  <h3 className="ranking-podium__name">{user.name}</h3>
                  <p className="ranking-podium__nickname">{user.rolNickname}</p>
                  <div className="ranking-podium__stats">
                    <p className="ranking-podium__stat">평점 {user.rating}</p>
                    <p className="ranking-podium__stat">승률 {user.winRate}%</p>
                    <p className={`ranking-podium__tier ${getTierClass(user.tier)}`}>{user.tier} 등급</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Full Rankings Table */}
      <section className="matches-table">
        <div className="matches-table__container">
          <div className="matches-table__wrapper">
            <table className="matches-table__table">
              <thead>
                <tr className="matches-table__header-row">
                  <th className="matches-table__th">순위</th>
                  <th className="matches-table__th">사용자명</th>
                  <th className="matches-table__th">롤 닉네임</th>
                  <th className="matches-table__th">등급</th>
                  <th className="matches-table__th">평점</th>
                  <th className="matches-table__th">경기</th>
                  <th className="matches-table__th">승률</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.rank} className="matches-table__row">
                    <td className="matches-table__td">
                      <span className={`ranking-badge ranking-badge--${user.rank <= 3 ? user.rank : 'default'}`}>
                        {user.rank}
                      </span>
                    </td>
                    <td className="matches-table__td matches-table__td--name">{user.name}</td>
                    <td className="matches-table__td matches-table__td--nickname">{user.rolNickname}</td>
                    <td className="matches-table__td">
                      <span className={`tier-badge ${getTierClass(user.tier)}`}>{user.tier}</span>
                    </td>
                    <td className="matches-table__td matches-table__td--rating">{user.rating}</td>
                    <td className="matches-table__td">
                      <span className="matches-table__wins">{user.wins}</span>
                      <span className="matches-table__separator">/</span>
                      <span className="matches-table__losses">{user.losses}</span>
                    </td>
                    <td className="matches-table__td">
                      <div className="winrate-cell">
                        <div className="winrate-bar">
                          <div className="winrate-bar__fill" style={{ width: `${user.winRate}%` }}></div>
                        </div>
                        <span className="winrate-cell__value">{user.winRate}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Tier Distribution */}
      <section className="tier-distribution">
        <div className="tier-distribution__container">
          <h2 className="tier-distribution__title">등급 분포</h2>
          <div className="tier-distribution__grid">
            {['S', 'A+', 'A', 'B+', 'B', 'C', 'D'].map((tier) => {
              const count = users.filter(u => u.tier === tier).length;
              return (
                <div key={tier} className={`tier-distribution__card ${getTierClass(tier)}`}>
                  <p className="tier-distribution__tier">{tier}</p>
                  <p className="tier-distribution__count">{count}</p>
                  <p className="tier-distribution__label">유저</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
};

export default UserRankingPage;
