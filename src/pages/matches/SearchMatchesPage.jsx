import React, { useEffect, useMemo, useState } from 'react';
import { analysisAPI } from '../../api/analysisAPI';
import '../../styles/pages/MatchesPages.css';

const MIN_GAMES = 3;
const RANKING_LIMIT = 100;

const SearchMatchesPage = () => {
  const [searchPlayer, setSearchPlayer] = useState('');
  const [rankings, setRankings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const fetchRankings = async () => {
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

    fetchRankings();
  }, []);

  const filteredRankings = useMemo(() => {
    const keyword = searchPlayer.trim().toLowerCase();
    if (!keyword) {
      return rankings;
    }

    return rankings.filter((player) => player.playerName?.toLowerCase().includes(keyword));
  }, [rankings, searchPlayer]);

  const suggestions = useMemo(() => rankings.slice(0, 8), [rankings]);

  const formatAverageKda = (player) =>
    `${player.averageKills ?? 0} / ${player.averageDeaths ?? 0} / ${player.averageAssists ?? 0}`;

  const formatAverageNumber = (value) => (value ?? 0).toLocaleString();

  return (
    <div className="matches-page">
      <section className="matches-hero">
        <div className="matches-hero__container">
          <span className="matches-hero__eyebrow">Player Search</span>
          <h1 className="matches-hero__title">전적 검색</h1>
          <p className="matches-hero__description">
            실제 확정된 내전 전적을 기준으로 승리 순 랭킹과 플레이어 기록을 한 화면에서 확인할 수 있습니다.
          </p>
        </div>
      </section>

      <section className="matches-search">
        <div className="matches-search__container">
          <label className="matches-search__label">플레이어 검색</label>
          <div className="matches-search__input-group">
            <input
              type="text"
              value={searchPlayer}
              onChange={(event) => setSearchPlayer(event.target.value)}
              placeholder="플레이어 이름을 입력해 주세요"
              className="matches-search__input"
            />
          </div>

          <p className="matches-search__suggestions-label">
            3경기 이상 확정 전적 기준, 상위 {Math.min(rankings.length, RANKING_LIMIT)}명
          </p>

          {suggestions.length > 0 && (
            <div className="matches-search__suggestions">
              {suggestions.map((player) => (
                <button
                  key={`${player.rank}-${player.playerName}`}
                  onClick={() => setSearchPlayer(player.playerName)}
                  className="matches-search__suggestion"
                >
                  {player.playerName}
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="matches-table">
        <div className="matches-table__container">
          {errorMessage && <p className="match-upload__error">{errorMessage}</p>}
          <div className="matches-table__wrapper">
            <table className="matches-table__table">
              <thead>
                <tr className="matches-table__header-row">
                  <th className="matches-table__th">순위</th>
                  <th className="matches-table__th">플레이어</th>
                  <th className="matches-table__th">승</th>
                  <th className="matches-table__th">패</th>
                  <th className="matches-table__th">총 경기</th>
                  <th className="matches-table__th">승률</th>
                  <th className="matches-table__th">평균 K/D/A</th>
                  <th className="matches-table__th">평균 CS</th>
                  <th className="matches-table__th">평균 Gold</th>
                </tr>
              </thead>
              <tbody>
                {!isLoading && filteredRankings.length > 0 ? (
                  filteredRankings.map((player) => (
                    <tr key={`${player.rank}-${player.playerName}`} className="matches-table__row">
                      <td className="matches-table__td matches-table__td--name">{player.rank}</td>
                      <td className="matches-table__td matches-table__td--name">{player.playerName}</td>
                      <td className="matches-table__td">{player.wins}</td>
                      <td className="matches-table__td">{player.losses}</td>
                      <td className="matches-table__td">{player.totalGames}</td>
                      <td className="matches-table__td">{player.winRate}%</td>
                      <td className="matches-table__td matches-table__td--kda">{formatAverageKda(player)}</td>
                      <td className="matches-table__td">{formatAverageNumber(player.averageCs)}</td>
                      <td className="matches-table__td">{formatAverageNumber(player.averageGold)}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="9" className="matches-table__empty">
                      {isLoading ? '랭킹을 불러오는 중입니다.' : '검색 조건에 맞는 플레이어가 없습니다.'}
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
