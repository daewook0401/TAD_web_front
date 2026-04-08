import React, { useState } from 'react';
import '../../styles/pages/MatchesPages.css';

const SearchMatchesPage = () => {
  const [searchPlayer, setSearchPlayer] = useState('');
  const [searchResult, setSearchResult] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);

  const playerDatabase = [
    { id: 1, name: 'ProGamer123', totalMatches: 234, winRate: 58, avgKda: '12.4', mainGame: 'League of Legends', tier: 'Diamond' },
    { id: 2, name: 'MapleKing', totalMatches: 189, winRate: 62, avgKda: '14.2', mainGame: 'Mapleland', tier: 'Platinum' },
    { id: 3, name: 'SilverLord', totalMatches: 456, winRate: 51, avgKda: '9.8', mainGame: 'League of Legends', tier: 'Silver' },
    { id: 4, name: 'GoldRush', totalMatches: 312, winRate: 55, avgKda: '11.3', mainGame: 'Both', tier: 'Gold' },
    { id: 5, name: 'NewbiePlayer', totalMatches: 78, winRate: 48, avgKda: '8.2', mainGame: 'League of Legends', tier: 'Bronze' },
  ];

  const handleSearch = () => {
    if (!searchPlayer.trim()) {
      alert('플레이어 이름을 입력해주세요');
      return;
    }
    const result = playerDatabase.find(p => p.name.toLowerCase() === searchPlayer.toLowerCase());
    setSearchResult(result || null);
    setHasSearched(true);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="matches-page">
      {/* Hero Section */}
      <section className="matches-hero">
        <div className="matches-hero__container">
          <span className="matches-hero__eyebrow">Player Search</span>
          <h1 className="matches-hero__title">전적 확인</h1>
          <p className="matches-hero__description">플레이어 이름으로 기록, 승률, 최근 흐름을 빠르게 확인하세요.</p>
        </div>
      </section>

      {/* Search Section */}
      <section className="matches-search">
        <div className="matches-search__container">
          <label className="matches-search__label">플레이어 검색</label>
          <div className="matches-search__input-group">
            <input
              type="text"
              value={searchPlayer}
              onChange={(e) => setSearchPlayer(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="플레이어 이름을 입력하세요 (예: ProGamer123)"
              className="matches-search__input"
            />
            <button onClick={handleSearch} className="matches-search__btn">
              검색
            </button>
          </div>

          <div>
            <p className="matches-search__suggestions-label">인기 플레이어 예시</p>
            <div className="matches-search__suggestions">
              {playerDatabase.map((player) => (
                <button
                  key={player.id}
                  onClick={() => {
                    setSearchPlayer(player.name);
                    setSearchResult(player);
                    setHasSearched(true);
                  }}
                  className="matches-search__suggestion"
                >
                  {player.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Search Results */}
      {hasSearched && (
        <section className="matches-results">
          <div className="matches-results__container">
            {searchResult ? (
              <>
                {/* Player Profile */}
                <div className="player-profile">
                  <div className="player-profile__inner">
                    <div className="player-profile__header">
                      <div className="player-profile__avatar">
                        {searchResult.name.charAt(0)}
                      </div>
                      <div>
                        <h2 className="player-profile__name">{searchResult.name}</h2>
                        <p className="player-profile__game">주 게임: {searchResult.mainGame}</p>
                      </div>
                    </div>
                    <div className="player-profile__stats">
                      <div className="player-stat">
                        <p className="player-stat__label">총 경기</p>
                        <p className="player-stat__value">{searchResult.totalMatches}</p>
                      </div>
                      <div className="player-stat">
                        <p className="player-stat__label">승률</p>
                        <p className="player-stat__value">{searchResult.winRate}%</p>
                      </div>
                      <div className="player-stat">
                        <p className="player-stat__label">평균 K/D/A</p>
                        <p className="player-stat__value">{searchResult.avgKda}</p>
                      </div>
                      <div className="player-stat">
                        <p className="player-stat__label">현재 티어</p>
                        <p className="player-stat__value">{searchResult.tier}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Detailed Stats */}
                <div className="matches-stats-grid">
                  <div className="stats-card">
                    <h3 className="stats-card__title">게임별 통계</h3>
                    <div className="stats-card__games">
                      <div className="game-stat">
                        <div className="game-stat__header">
                          <p className="game-stat__name">League of Legends</p>
                          <p className="game-stat__count">155 경기</p>
                        </div>
                        <div className="game-stat__bar">
                          <div className="game-stat__fill" style={{ width: '66%' }}></div>
                        </div>
                      </div>
                      <div className="game-stat">
                        <div className="game-stat__header">
                          <p className="game-stat__name">Mapleland</p>
                          <p className="game-stat__count">79 경기</p>
                        </div>
                        <div className="game-stat__bar">
                          <div className="game-stat__fill" style={{ width: '34%' }}></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="stats-card">
                    <h3 className="stats-card__title">최근 7일</h3>
                    <div className="stats-card__weekly">
                      <div className="weekly-stat">
                        <p className="weekly-stat__label">이번 주 경기</p>
                        <p className="weekly-stat__value">23</p>
                      </div>
                      <div className="weekly-stat">
                        <p className="weekly-stat__label">승리</p>
                        <p className="weekly-stat__value">14</p>
                      </div>
                      <div className="weekly-stat">
                        <p className="weekly-stat__label">패배</p>
                        <p className="weekly-stat__value">9</p>
                      </div>
                      <div className="weekly-stat">
                        <p className="weekly-stat__label">승률</p>
                        <p className="weekly-stat__value">60.9%</p>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="matches-empty">
                <svg className="matches-empty__icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <h3 className="matches-empty__title">검색 결과 없음</h3>
                <p className="matches-empty__description">"{searchPlayer}"에 해당하는 플레이어를 찾을 수 없습니다.</p>
              </div>
            )}
          </div>
        </section>
      )}
    </div>
  );
};

export default SearchMatchesPage;
