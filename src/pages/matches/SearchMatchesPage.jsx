import React, { useEffect, useMemo, useState } from 'react';
import { analysisAPI } from '../../api/analysisAPI';
import '../../styles/pages/MatchesPages.css';

const MIN_GAMES = 3;
const RANKING_LIMIT = 100;

const SearchMatchesPage = () => {
  const [searchPlayer, setSearchPlayer] = useState('');
  const [submittedKeyword, setSubmittedKeyword] = useState('');
  const [rankings, setRankings] = useState([]);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [playerRecords, setPlayerRecords] = useState([]);
  const [selectedGameDetail, setSelectedGameDetail] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [recordsLoading, setRecordsLoading] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [recordsErrorMessage, setRecordsErrorMessage] = useState('');
  const [detailErrorMessage, setDetailErrorMessage] = useState('');

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

  const formatDate = (value) => {
    if (!value) return '-';

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return '-';

    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  };

  const searchedRankings = useMemo(() => {
    const keyword = submittedKeyword.trim().toLowerCase();
    if (!keyword) {
      return rankings;
    }

    return rankings.filter((player) => player.playerName?.toLowerCase().includes(keyword));
  }, [rankings, submittedKeyword]);

  const selectedSummary = useMemo(() => {
    if (!selectedPlayer) return null;
    return rankings.find((player) => player.playerName === selectedPlayer) ?? null;
  }, [rankings, selectedPlayer]);

  const detailPlayers = useMemo(() => {
    if (!selectedGameDetail) {
      return [];
    }

    return [
      ...(selectedGameDetail.team1?.players ?? []),
      ...(selectedGameDetail.team2?.players ?? []),
    ];
  }, [selectedGameDetail]);

  const handleSearch = async (event) => {
    event.preventDefault();

    const keyword = searchPlayer.trim();
    setSubmittedKeyword(keyword);
    setSelectedPlayer(null);
    setPlayerRecords([]);
    setSelectedGameDetail(null);
    setRecordsErrorMessage('');
    setDetailErrorMessage('');
    setErrorMessage('');
    setIsLoading(true);

    try {
      const response = await analysisAPI.getRankings({
        keyword: keyword || undefined,
        minGames: MIN_GAMES,
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

  const handleSelectPlayer = async (playerName) => {
    setSelectedPlayer(playerName);
    setSelectedGameDetail(null);
    setRecordsLoading(true);
    setRecordsErrorMessage('');
    setDetailErrorMessage('');

    try {
      const response = await analysisAPI.getPlayerRecords(playerName);
      setPlayerRecords(response.data ?? []);
    } catch (error) {
      setPlayerRecords([]);
      setRecordsErrorMessage(error.response?.data?.message || '선수별 경기 기록을 불러오지 못했습니다.');
    } finally {
      setRecordsLoading(false);
    }
  };

  const handleSelectGame = async (gameNumber) => {
    setDetailLoading(true);
    setDetailErrorMessage('');

    try {
      const response = await analysisAPI.getPublicRecordDetail(gameNumber);
      setSelectedGameDetail(response.data);
    } catch (error) {
      setSelectedGameDetail(null);
      setDetailErrorMessage(error.response?.data?.message || '경기 상세 기록을 불러오지 못했습니다.');
    } finally {
      setDetailLoading(false);
    }
  };

  return (
    <div className="matches-page">
      <section className="matches-hero">
        <div className="matches-hero__container">
          <span className="matches-hero__eyebrow">Player Search</span>
          <h1 className="matches-hero__title">전적 검색</h1>
          <p className="matches-hero__description">
            닉네임을 입력하고 검색 버튼을 누른 뒤, 플레이어와 판을 차례로 눌러 상세 기록을 확인하세요.
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
            추천 플레이어를 누르면 입력만 채워집니다. 실제 검색은 전적 검색 버튼을 눌러야 실행됩니다.
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
                {submittedKeyword ? `"${submittedKeyword}" 검색 결과` : '상위 플레이어'}
              </h2>
            </div>
            <p className="matches-section-heading__meta">
              {MIN_GAMES}경기 이상 확정 전적 기준, 최대 {RANKING_LIMIT}명
            </p>
          </div>

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
                {!isLoading && searchedRankings.length > 0 ? (
                  searchedRankings.map((player) => (
                    <tr key={`${player.rank}-${player.playerName}`} className="matches-table__row">
                      <td className="matches-table__td">
                        <span className={`ranking-badge ranking-badge--${player.rank}`}>{player.rank}</span>
                      </td>
                      <td className="matches-table__td matches-table__td--name">
                        <button
                          type="button"
                          className="matches-player-link"
                          onClick={() => handleSelectPlayer(player.playerName)}
                        >
                          {player.playerName}
                        </button>
                      </td>
                      <td className="matches-table__td">{player.wins}</td>
                      <td className="matches-table__td">{player.losses}</td>
                      <td className="matches-table__td">{player.totalGames}</td>
                      <td className="matches-table__td">{player.winRate}%</td>
                      <td className="matches-table__td matches-table__td--kda">{formatAverageKda(player)}</td>
                      <td className="matches-table__td">{formatNumber(player.averageCs)}</td>
                      <td className="matches-table__td">{formatNumber(player.averageGold)}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="9" className="matches-table__empty">
                      {isLoading ? '전적을 검색하는 중입니다.' : '검색 조건에 맞는 플레이어가 없습니다.'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {selectedPlayer && (
            <div className="player-records">
              <div className="player-records__header">
                <div>
                  <p className="matches-section-heading__eyebrow">경기별 기록</p>
                  <h2 className="player-records__title">{selectedPlayer}</h2>
                  <p className="player-records__description">
                    경기 번호 또는 자세히 버튼을 누르면 양 팀 전체 스탯을 볼 수 있습니다.
                  </p>
                </div>

                {selectedSummary && (
                  <div className="player-records__summary">
                    <span>{selectedSummary.totalGames}전</span>
                    <strong>{selectedSummary.wins}승 {selectedSummary.losses}패</strong>
                    <span>승률 {selectedSummary.winRate}%</span>
                  </div>
                )}
              </div>

              {recordsErrorMessage && <p className="match-upload__error">{recordsErrorMessage}</p>}

              <div className="matches-table__wrapper">
                <table className="matches-table__table">
                  <thead>
                    <tr className="matches-table__header-row">
                      <th className="matches-table__th">경기</th>
                      <th className="matches-table__th">결과</th>
                      <th className="matches-table__th">팀</th>
                      <th className="matches-table__th">K/D/A</th>
                      <th className="matches-table__th">CS</th>
                      <th className="matches-table__th">Gold</th>
                      <th className="matches-table__th">확정일</th>
                      <th className="matches-table__th">상세</th>
                    </tr>
                  </thead>
                  <tbody>
                    {!recordsLoading && playerRecords.length > 0 ? (
                      playerRecords.map((record) => (
                        <tr key={`${record.gameNumber}-${record.slotNumber}`} className="matches-table__row">
                          <td className="matches-table__td">
                            <button
                              type="button"
                              className="matches-player-link"
                              onClick={() => handleSelectGame(record.gameNumber)}
                            >
                              #{record.gameNumber}
                            </button>
                          </td>
                          <td className="matches-table__td">
                            <span
                              className={`matches-table__result ${
                                record.result === 'WIN'
                                  ? 'matches-table__result--win'
                                  : 'matches-table__result--loss'
                              }`}
                            >
                              {record.result === 'WIN' ? '승리' : '패배'}
                            </span>
                          </td>
                          <td className="matches-table__td">{record.teamKey}</td>
                          <td className="matches-table__td matches-table__td--kda">
                            {record.kills ?? 0} / {record.deaths ?? 0} / {record.assists ?? 0}
                          </td>
                          <td className="matches-table__td">{formatNumber(record.cs)}</td>
                          <td className="matches-table__td">{formatNumber(record.gold)}</td>
                          <td className="matches-table__td">{formatDate(record.confirmedAt || record.createdAt)}</td>
                          <td className="matches-table__td">
                            <button
                              type="button"
                              className="matches-record-link"
                              onClick={() => handleSelectGame(record.gameNumber)}
                            >
                              자세히
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="8" className="matches-table__empty">
                          {recordsLoading ? '경기별 기록을 불러오는 중입니다.' : '표시할 경기 기록이 없습니다.'}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {detailErrorMessage && <p className="match-upload__error">{detailErrorMessage}</p>}

              {(detailLoading || selectedGameDetail) && (
                <div className="match-detail-panel">
                  {detailLoading ? (
                    <p className="matches-table__empty">경기 상세를 불러오는 중입니다.</p>
                  ) : (
                    <>
                      <div className="match-detail-panel__header">
                        <div>
                          <p className="matches-section-heading__eyebrow">판 상세</p>
                          <h3 className="match-detail-panel__title">경기 #{selectedGameDetail.gameNumber}</h3>
                          <p className="player-records__description">
                            승리 팀: {selectedGameDetail.winner || '-'} / 상태: {selectedGameDetail.status}
                          </p>
                        </div>

                        {selectedGameDetail.screenshotUrl && (
                          <a
                            href={selectedGameDetail.screenshotUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="matches-record-link"
                          >
                            스크린샷 보기
                          </a>
                        )}
                      </div>

                      <div className="matches-table__wrapper">
                        <table className="matches-table__table">
                          <thead>
                            <tr className="matches-table__header-row">
                              <th className="matches-table__th">팀</th>
                              <th className="matches-table__th">슬롯</th>
                              <th className="matches-table__th">플레이어</th>
                              <th className="matches-table__th">결과</th>
                              <th className="matches-table__th">K/D/A</th>
                              <th className="matches-table__th">CS</th>
                              <th className="matches-table__th">Gold</th>
                            </tr>
                          </thead>
                          <tbody>
                            {detailPlayers.map((player) => (
                              <tr key={player.statId} className="matches-table__row">
                                <td className="matches-table__td">{player.teamKey}</td>
                                <td className="matches-table__td">{player.slotNumber}</td>
                                <td className="matches-table__td matches-table__td--name">{player.name || '-'}</td>
                                <td className="matches-table__td">
                                  <span
                                    className={`matches-table__result ${
                                      player.winner
                                        ? 'matches-table__result--win'
                                        : 'matches-table__result--loss'
                                    }`}
                                  >
                                    {player.winner ? '승리' : '패배'}
                                  </span>
                                </td>
                                <td className="matches-table__td matches-table__td--kda">
                                  {player.kills ?? 0} / {player.deaths ?? 0} / {player.assists ?? 0}
                                </td>
                                <td className="matches-table__td">{formatNumber(player.cs)}</td>
                                <td className="matches-table__td">{formatNumber(player.gold)}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default SearchMatchesPage;
