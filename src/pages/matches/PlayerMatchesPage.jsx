import React, { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { analysisAPI } from '../../api/analysisAPI';
import '../../styles/pages/MatchesPages.css';

const PlayerMatchesPage = () => {
  const { playerName: encodedPlayerName } = useParams();
  const playerName = decodeURIComponent(encodedPlayerName ?? '');
  const [summary, setSummary] = useState(null);
  const [records, setRecords] = useState([]);
  const [selectedGameDetail, setSelectedGameDetail] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [detailLoading, setDetailLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [detailErrorMessage, setDetailErrorMessage] = useState('');

  useEffect(() => {
    const fetchPlayer = async () => {
      setIsLoading(true);
      setErrorMessage('');
      setDetailErrorMessage('');
      setSelectedGameDetail(null);

      try {
        const [rankingResponse, recordsResponse] = await Promise.all([
          analysisAPI.getRankings({
            keyword: playerName,
            minGames: 1,
            limit: 100,
          }),
          analysisAPI.getPlayerRecords(playerName),
        ]);

        const matchedSummary = (rankingResponse.data ?? []).find((player) => player.playerName === playerName)
          ?? rankingResponse.data?.[0]
          ?? null;

        setSummary(matchedSummary);
        setRecords(recordsResponse.data ?? []);
      } catch (error) {
        setErrorMessage(error.response?.data?.message || '플레이어 전적을 불러오지 못했습니다.');
      } finally {
        setIsLoading(false);
      }
    };

    if (playerName) {
      fetchPlayer();
    }
  }, [playerName]);

  const detailPlayers = useMemo(() => {
    if (!selectedGameDetail) return [];

    return [
      ...(selectedGameDetail.team1?.players ?? []),
      ...(selectedGameDetail.team2?.players ?? []),
    ];
  }, [selectedGameDetail]);

  const formatKda = (kills, deaths, assists) =>
    `${kills ?? 0} / ${deaths ?? 0} / ${assists ?? 0}`;

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

  if (isLoading) {
    return (
      <div className="matches-page">
        <section className="matches-results">
          <div className="matches-results__container">
            <div className="matches-empty">
              <h3 className="matches-empty__title">플레이어 전적을 불러오는 중입니다.</h3>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="matches-page">
      <section className="matches-hero">
        <div className="matches-hero__container matches-hero__container--split">
          <div>
            <span className="matches-hero__eyebrow">Player Profile</span>
            <h1 className="matches-hero__title">{playerName}</h1>
            <p className="matches-hero__description">
              확정된 내전 기록 기준 평균 지표와 경기별 기록을 확인할 수 있습니다.
            </p>
          </div>
          <div className="matches-hero__user">
            <p className="matches-hero__user-label">총 경기</p>
            <p className="matches-hero__user-name">{summary?.totalGames ?? records.length}</p>
          </div>
        </div>
      </section>

      <section className="my-stats">
        <div className="my-stats__grid">
          <div className="my-stats__card">
            <p className="my-stats__label">승 / 패</p>
            <p className="my-stats__value">{summary ? `${summary.wins} / ${summary.losses}` : '-'}</p>
          </div>
          <div className="my-stats__card">
            <p className="my-stats__label">승률</p>
            <p className="my-stats__value my-stats__value--win">{summary?.winRate ?? 0}%</p>
          </div>
          <div className="my-stats__card">
            <p className="my-stats__label">평균 K/D/A</p>
            <p className="my-stats__value match-upload__stat-text">
              {summary ? formatKda(summary.averageKills, summary.averageDeaths, summary.averageAssists) : '-'}
            </p>
          </div>
          <div className="my-stats__card">
            <p className="my-stats__label">평균 CS</p>
            <p className="my-stats__value">{formatNumber(summary?.averageCs)}</p>
          </div>
          <div className="my-stats__card">
            <p className="my-stats__label">평균 Gold</p>
            <p className="my-stats__value">{formatNumber(summary?.averageGold)}</p>
          </div>
        </div>
      </section>

      <section className="matches-table">
        <div className="matches-table__container">
          {errorMessage && <p className="match-upload__error">{errorMessage}</p>}

          <div className="match-review__actions">
            <Link to="/matches/search" className="match-review__secondary">
              전적 검색으로 돌아가기
            </Link>
          </div>

          <div className="matches-section-heading">
            <div>
              <p className="matches-section-heading__eyebrow">Match History</p>
              <h2 className="matches-section-heading__title">경기별 기록</h2>
            </div>
            <p className="matches-section-heading__meta">최신 확정 경기순</p>
          </div>

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
                {records.length > 0 ? (
                  records.map((record) => (
                    <tr key={`${record.gameNumber}-${record.slotNumber}`} className="matches-table__row">
                      <td className="matches-table__td">#{record.gameNumber}</td>
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
                        {formatKda(record.kills, record.deaths, record.assists)}
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
                      표시할 경기 기록이 없습니다.
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
                      <p className="matches-section-heading__eyebrow">Review Detail</p>
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
                              {formatKda(player.kills, player.deaths, player.assists)}
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
      </section>
    </div>
  );
};

export default PlayerMatchesPage;
