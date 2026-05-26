import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { analysisAPI } from '../../api/analysisAPI';
import { useAuth } from '../../provider/AuthContext';
import '../../styles/pages/MatchesPages.css';

const formatDateTime = (value) => {
  if (!value) {
    return '-';
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

const formatWinnerLabel = (winner) => {
  if (winner === 'team1') return '1팀';
  if (winner === 'team2') return '2팀';
  return '-';
};

const MyMatchesPage = () => {
  const { isAuthenticated, isLoading: isAuthLoading, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [records, setRecords] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const isFetchingRef = useRef(false);

  const getNormalizedStatus = useCallback((record) => {
    if (!record) {
      return 'PROCESSING';
    }

    if (record.status === 'CONFIRMED' && !record.confirmedAt) {
      return (record.recognizedPlayers ?? 0) > 0 ? 'DRAFT' : 'PROCESSING';
    }

    return record.status ?? 'PROCESSING';
  }, []);

  const fetchRecords = useCallback(async (showLoading = false) => {
    if (isFetchingRef.current) {
      return;
    }

    isFetchingRef.current = true;
    if (showLoading) {
      setIsLoading(true);
    }

    try {
      const response = await analysisAPI.getMyRecords();
      setRecords(response.data);
      setErrorMessage('');
    } catch (error) {
      setErrorMessage(error.response?.data?.message || '내 전적 목록을 불러오지 못했습니다.');
    } finally {
      isFetchingRef.current = false;
      if (showLoading) {
        setIsLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    if (isAuthLoading) {
      return;
    }

    if (!isAuthenticated) {
      navigate('/login', { replace: true });
      return;
    }

    fetchRecords(true);
  }, [fetchRecords, isAuthLoading, isAuthenticated, navigate]);

  useEffect(() => {
    if (isAuthLoading || !isAuthenticated) {
      return undefined;
    }

    const hasProcessing = records.some((record) => getNormalizedStatus(record) === 'PROCESSING');
    if (!hasProcessing) {
      return undefined;
    }

    let timeoutId;
    let cancelled = false;

    const poll = async () => {
      await fetchRecords(false);
      if (!cancelled) {
        timeoutId = window.setTimeout(poll, 5000);
      }
    };

    timeoutId = window.setTimeout(poll, 5000);

    return () => {
      cancelled = true;
      window.clearTimeout(timeoutId);
    };
  }, [fetchRecords, getNormalizedStatus, isAuthLoading, isAuthenticated, records]);

  const enrichedRecords = useMemo(() => records.map((record) => ({
    ...record,
    normalizedStatus: getNormalizedStatus(record),
  })), [getNormalizedStatus, records]);

  const stats = useMemo(() => {
    const confirmedMatches = enrichedRecords.filter((record) => record.normalizedStatus === 'CONFIRMED').length;
    const drafts = enrichedRecords.filter((record) => record.normalizedStatus === 'DRAFT').length;
    const processing = enrichedRecords.filter((record) => record.normalizedStatus === 'PROCESSING').length;

    return {
      totalMatches: enrichedRecords.length,
      confirmedMatches,
      drafts,
      processing,
      recognizedPlayers: enrichedRecords.reduce((sum, record) => sum + (record.recognizedPlayers ?? 0), 0),
    };
  }, [enrichedRecords]);

  const dashboard = useMemo(() => {
    const confirmedRecords = enrichedRecords.filter((record) => record.normalizedStatus === 'CONFIRMED');
    const reviewQueue = enrichedRecords.filter((record) => record.normalizedStatus === 'DRAFT').slice(0, 4);
    const winnerCounts = confirmedRecords.reduce((acc, record) => {
      if (record.winner === 'team1' || record.winner === 'team2') {
        acc[record.winner] += 1;
      }
      return acc;
    }, { team1: 0, team2: 0 });
    const winnerTotal = winnerCounts.team1 + winnerCounts.team2;
    const totalMatches = enrichedRecords.length;

    return {
      confirmedRate: totalMatches > 0 ? Math.round((confirmedRecords.length / totalMatches) * 100) : 0,
      averageRecognizedPlayers: totalMatches > 0 ? (stats.recognizedPlayers / totalMatches).toFixed(1) : '0.0',
      latestUpload: enrichedRecords[0] ?? null,
      latestConfirmed: confirmedRecords[0] ?? null,
      reviewQueue,
      recentConfirmed: confirmedRecords.slice(0, 4),
      winnerCounts,
      winnerTotal,
    };
  }, [enrichedRecords, stats.recognizedPlayers]);

  const getStatusLabel = (status) => {
    switch (status) {
      case 'PROCESSING':
        return '준비중';
      case 'DRAFT':
        return '검수 필요';
      case 'CONFIRMED':
        return '확정 완료';
      case 'FAILED':
        return '분석 실패';
      default:
        return status;
    }
  };

  const getStatusClassName = (status) => {
    switch (status) {
      case 'CONFIRMED':
        return 'matches-table__result--win';
      case 'DRAFT':
        return 'matches-table__result--loss';
      case 'PROCESSING':
      case 'FAILED':
      default:
        return 'matches-table__result--neutral';
    }
  };

  const getActionContent = (record, status) => {
    if (status === 'DRAFT' || status === 'CONFIRMED') {
      return (
        <Link to={`/matches/review/${record.gameNumber}`} className="match-upload__link">
          {status === 'DRAFT' ? '검수하기' : '상세 보기'}
        </Link>
      );
    }

    return (
      <span className="match-review__hint">
        {status === 'PROCESSING' ? '분석 중' : '확인 불가'}
      </span>
    );
  };

  if (isAuthLoading || !isAuthenticated) {
    return null;
  }

  return (
    <div className="matches-page">
      <section className="matches-hero">
        <div className="matches-hero__container matches-hero__container--split">
          <div>
            <span className="matches-hero__eyebrow">My Match Log</span>
            <h1 className="matches-hero__title">내 전적 확인</h1>
            <p className="matches-hero__description">
              업로드한 내전 기록의 분석 진행 상태와 검수 여부를 한눈에 확인할 수 있습니다.
            </p>
            <Link to="/matches/upload" className="match-upload__cta">
              새 내전 기록 업로드
            </Link>
          </div>
          <div className="matches-hero__user">
            <p className="matches-hero__user-label">환영합니다</p>
            <p className="matches-hero__user-name">{user?.nickname || '사용자'}</p>
          </div>
        </div>
      </section>

      {location.state?.message && (
        <section className="matches-search">
          <div className="matches-search__container">
            <p className="match-upload__status">{location.state.message}</p>
          </div>
        </section>
      )}

      {errorMessage && (
        <section className="matches-search">
          <div className="matches-search__container">
            <p className="match-upload__error">{errorMessage}</p>
          </div>
        </section>
      )}

      <section className="my-stats">
        <div className="my-stats__grid">
          <div className="my-stats__card">
            <p className="my-stats__label">총 업로드</p>
            <p className="my-stats__value">{stats.totalMatches}</p>
          </div>
          <div className="my-stats__card">
            <p className="my-stats__label">준비중</p>
            <p className="my-stats__value">{stats.processing}</p>
          </div>
          <div className="my-stats__card">
            <p className="my-stats__label">검수 필요</p>
            <p className="my-stats__value my-stats__value--loss">{stats.drafts}</p>
          </div>
          <div className="my-stats__card">
            <p className="my-stats__label">확정 완료</p>
            <p className="my-stats__value my-stats__value--win">{stats.confirmedMatches}</p>
          </div>
          <div className="my-stats__card">
            <p className="my-stats__label">인식 플레이어</p>
            <p className="my-stats__value">{stats.recognizedPlayers}</p>
          </div>
        </div>
      </section>

      <section className="matches-dashboard">
        <div className="matches-dashboard__container">
          <div className="matches-section-heading">
            <div>
              <p className="matches-section-heading__eyebrow">Dashboard</p>
              <h2 className="matches-section-heading__title">전적 요약</h2>
            </div>
            <p className="matches-section-heading__meta">최근 업로드 기준</p>
          </div>

          <div className="matches-dashboard__grid">
            <article className="matches-dashboard__panel matches-dashboard__panel--wide">
              <div className="matches-dashboard__panel-header">
                <h3>진행 현황</h3>
                <strong>{dashboard.confirmedRate}%</strong>
              </div>
              <div className="matches-dashboard__progress" aria-hidden="true">
                <span style={{ width: `${dashboard.confirmedRate}%` }} />
              </div>
              <div className="matches-dashboard__metrics">
                <div>
                  <span>평균 인식 플레이어</span>
                  <strong>{dashboard.averageRecognizedPlayers}</strong>
                </div>
                <div>
                  <span>최근 업로드</span>
                  <strong>{formatDateTime(dashboard.latestUpload?.createdAt)}</strong>
                </div>
                <div>
                  <span>최근 확정</span>
                  <strong>{formatDateTime(dashboard.latestConfirmed?.confirmedAt || dashboard.latestConfirmed?.createdAt)}</strong>
                </div>
              </div>
            </article>

            <article className="matches-dashboard__panel">
              <div className="matches-dashboard__panel-header">
                <h3>승리팀 분포</h3>
                <strong>{dashboard.winnerTotal}</strong>
              </div>
              <div className="matches-dashboard__bars">
                {['team1', 'team2'].map((teamKey) => {
                  const count = dashboard.winnerCounts[teamKey];
                  const percent = dashboard.winnerTotal > 0
                    ? Math.round((count / dashboard.winnerTotal) * 100)
                    : 0;

                  return (
                    <div key={teamKey} className="matches-dashboard__bar-row">
                      <span>{formatWinnerLabel(teamKey)}</span>
                      <div className="matches-dashboard__bar">
                        <span style={{ width: `${percent}%` }} />
                      </div>
                      <strong>{count}</strong>
                    </div>
                  );
                })}
              </div>
            </article>

            <article className="matches-dashboard__panel">
              <div className="matches-dashboard__panel-header">
                <h3>검수 대기</h3>
                <strong>{stats.drafts}</strong>
              </div>
              <div className="matches-dashboard__list">
                {dashboard.reviewQueue.length > 0 ? dashboard.reviewQueue.map((record) => (
                  <Link key={record.gameNumber} to={`/matches/review/${record.gameNumber}`}>
                    <span>#{record.gameNumber}</span>
                    <strong>{formatDateTime(record.createdAt)}</strong>
                  </Link>
                )) : (
                  <p>검수 필요한 기록이 없습니다.</p>
                )}
              </div>
            </article>

            <article className="matches-dashboard__panel">
              <div className="matches-dashboard__panel-header">
                <h3>최근 확정</h3>
                <strong>{stats.confirmedMatches}</strong>
              </div>
              <div className="matches-dashboard__list">
                {dashboard.recentConfirmed.length > 0 ? dashboard.recentConfirmed.map((record) => (
                  <Link key={record.gameNumber} to={`/matches/review/${record.gameNumber}`}>
                    <span>#{record.gameNumber}</span>
                    <strong>{formatWinnerLabel(record.winner)} 승리</strong>
                  </Link>
                )) : (
                  <p>확정된 기록이 없습니다.</p>
                )}
              </div>
            </article>
          </div>
        </div>
      </section>

      <section className="matches-table">
        <div className="matches-table__container">
          <div className="matches-table__wrapper">
            <table className="matches-table__table">
              <thead>
                <tr className="matches-table__header-row">
                  <th className="matches-table__th">게임 번호</th>
                  <th className="matches-table__th">업로드 시간</th>
                  <th className="matches-table__th">상태</th>
                  <th className="matches-table__th">승리 팀</th>
                  <th className="matches-table__th">인식 플레이어</th>
                  <th className="matches-table__th">확인</th>
                </tr>
              </thead>
              <tbody>
                {!isLoading && enrichedRecords.length > 0 ? (
                  enrichedRecords.map((record) => {
                    const status = record.normalizedStatus;

                    return (
                      <tr key={record.gameNumber} className="matches-table__row">
                        <td className="matches-table__td matches-table__td--name">{record.gameNumber}</td>
                        <td className="matches-table__td">{formatDateTime(record.createdAt)}</td>
                        <td className="matches-table__td">
                          <span className={`matches-table__result ${getStatusClassName(status)}`}>
                            {getStatusLabel(status)}
                          </span>
                        </td>
                        <td className="matches-table__td">
                          {status === 'PROCESSING' ? '-' : formatWinnerLabel(record.winner)}
                        </td>
                        <td className="matches-table__td">{record.recognizedPlayers ?? 0}</td>
                        <td className="matches-table__td">{getActionContent(record, status)}</td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="6" className="matches-table__empty">
                      {isLoading ? '업로드한 내전 기록을 불러오는 중입니다.' : '아직 업로드한 내전 기록이 없습니다.'}
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
