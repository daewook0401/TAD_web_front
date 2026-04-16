import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { analysisAPI } from '../../api/analysisAPI';
import '../../styles/pages/MatchesPages.css';

const MIN_GAMES = 3;
const SEARCH_MIN_GAMES = 1;
const RANKING_LIMIT = 100;

const SearchMatchesPage = () => {
  const navigate = useNavigate();
  const [searchPlayer, setSearchPlayer] = useState('');
  const [submittedKeyword, setSubmittedKeyword] = useState('');
  const [rankings, setRankings] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const fetchInitialRankings = async () => {
      setIsLoading(true);
      setErrorMessage('');

      try {
        const response = await analysisAPI.getRankings({
          minGames: MIN_GAMES,
          limit: RANKING_LIMIT,
        });
        setRankings(response.data ?? []);
      } catch (error) {
        setErrorMessage(error.response?.data?.message || '전적 순위를 불러오지 못했습니다.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchInitialRankings();
  }, []);

  const suggestions = useMemo(() => rankings.slice(0, 8), [rankings]);

  const formatAverageKda = (player) =>
    `${player.averageKills ?? 0} / ${player.averageDeaths ?? 0} / ${player.averageAssists ?? 0}`;

  const formatNumber = (value) => (value ?? 0).toLocaleString();

  const searchedRankings = useMemo(() => {
    const keyword = submittedKeyword.trim().toLowerCase();
    if (!keyword) {
      return rankings;
    }

    return rankings.filter((player) => player.playerName?.toLowerCase().includes(keyword));
  }, [rankings, submittedKeyword]);

  const handleSearch = async (event) => {
    event.preventDefault();

    const keyword = searchPlayer.trim();
    setSubmittedKeyword(keyword);
    setErrorMessage('');
    setIsLoading(true);

    try {
      const response = await analysisAPI.getRankings({
        keyword: keyword || undefined,
        minGames: keyword ? SEARCH_MIN_GAMES : MIN_GAMES,
        limit: RANKING_LIMIT,
      });
      setRankings(response.data ?? []);
    } catch (error) {
      setErrorMessage(error.response?.data?.message || '검색 결과를 불러오지 못했습니다.');
      setRankings([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenPlayer = (playerName) => {
    navigate(`/matches/players/${encodeURIComponent(playerName)}`);
  };

  return (
    <div className="matches-page">
      <section className="matches-hero">
        <div className="matches-hero__container">
          <span className="matches-hero__eyebrow">Player Search</span>
          <h1 className="matches-hero__title">전적 검색</h1>
          <p className="matches-hero__description">
            닉네임을 검색하고 플레이어를 선택하면 전용 전적 페이지에서 평균 기록과 판별 기록을 확인할 수 있습니다.
          </p>
        </div>
      </section>

      <section className="matches-search">
        <form className="matches-search__container" onSubmit={handleSearch}>
          <label className="matches-search__label" htmlFor="player-search">
            플레이어 닉네임
          </label>
          <div className="matches-search__input-group">
            <input
              id="player-search"
              type="text"
              value={searchPlayer}
              onChange={(event) => setSearchPlayer(event.target.value)}
              placeholder="플레이어 이름을 입력해 주세요."
              className="matches-search__input"
            />
            <button type="submit" className="matches-search__btn" disabled={isLoading}>
              {isLoading ? '검색 중...' : '전적 검색'}
            </button>
          </div>

          <p className="matches-search__suggestions-label">
            추천 플레이어를 누르면 입력만 채워집니다. 검색은 전적 검색 버튼으로 실행됩니다.
          </p>

          {suggestions.length > 0 && (
            <div className="matches-search__suggestions">
              {suggestions.map((player) => (
                <button
                  key={`${player.rank}-${player.playerName}`}
                  type="button"
                  onClick={() => setSearchPlayer(player.playerName)}
                  className="matches-search__suggestion"
                >
                  {player.playerName}
                </button>
              ))}
            </div>
          )}
        </form>
      </section>

      <section className="matches-table">
        <div className="matches-table__container">
          {errorMessage && <p className="match-upload__error">{errorMessage}</p>}

          <div className="matches-section-heading">
            <div>
              <p className="matches-section-heading__eyebrow">검색 결과</p>
              <h2 className="matches-section-heading__title">
                {submittedKeyword ? `"${submittedKeyword}" 플레이어` : '상위 플레이어'}
              </h2>
            </div>
            <p className="matches-section-heading__meta">
              {submittedKeyword ? '1경기 이상 확정 전적 기준' : `${MIN_GAMES}경기 이상 확정 전적 기준`}, 최대 {RANKING_LIMIT}명
            </p>
          </div>

          <div className="matches-table__wrapper">
            <table className="matches-table__table">
              <thead>
                <tr className="matches-table__header-row">
                  <th className="matches-table__th">순위</th>
                  <th className="matches-table__th">플레이어</th>
                  <th className="matches-table__th">총 경기</th>
                  <th className="matches-table__th">승률</th>
                  <th className="matches-table__th">평균 K/D/A</th>
                  <th className="matches-table__th">평균 CS</th>
                  <th className="matches-table__th">평균 Gold</th>
                </tr>
              </thead>
              <tbody>
                {!isLoading && searchedRankings.length > 0 ? (
                  searchedRankings.map((player) => (
                    <tr key={`${player.rank}-${player.playerName}`} className="matches-table__row">
                      <td className="matches-table__td">
                        <span className={`ranking-badge ${player.rank <= 3 ? `ranking-badge--${player.rank}` : ''}`}>
                          {player.rank}
                        </span>
                      </td>
                      <td className="matches-table__td matches-table__td--name">
                        <button
                          type="button"
                          className="matches-player-link"
                          onClick={() => handleOpenPlayer(player.playerName)}
                        >
                          {player.playerName}
                        </button>
                      </td>
                      <td className="matches-table__td">{player.totalGames}</td>
                      <td className="matches-table__td">{player.winRate}%</td>
                      <td className="matches-table__td matches-table__td--kda">{formatAverageKda(player)}</td>
                      <td className="matches-table__td">{formatNumber(player.averageCs)}</td>
                      <td className="matches-table__td">{formatNumber(player.averageGold)}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="matches-table__empty">
                      {isLoading ? '전적을 검색하는 중입니다.' : '검색 조건에 맞는 플레이어가 없습니다.'}
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

export default SearchMatchesPage;
