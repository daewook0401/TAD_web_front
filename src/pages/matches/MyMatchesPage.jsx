import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { analysisAPI } from '../../api/analysisAPI';
import { useAuth } from '../../provider/AuthContext';
import '../../styles/pages/MatchesPages.css';

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

  const stats = useMemo(() => {
    const confirmedMatches = records.filter((record) => getNormalizedStatus(record) === 'CONFIRMED').length;
    const drafts = records.filter((record) => getNormalizedStatus(record) === 'DRAFT').length;
    const processing = records.filter((record) => getNormalizedStatus(record) === 'PROCESSING').length;

    return {
      totalMatches: records.length,
      confirmedMatches,
      drafts,
      processing,
      recognizedPlayers: records.reduce((sum, record) => sum + (record.recognizedPlayers ?? 0), 0),
    };
  }, [getNormalizedStatus, records]);

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
                {!isLoading && records.length > 0 ? (
                  records.map((record) => {
                    const status = getNormalizedStatus(record);

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
                          {status === 'PROCESSING'
                            ? '-'
                            : record.winner === 'team1'
                              ? '1팀'
                              : record.winner === 'team2'
                                ? '2팀'
                                : '-'}
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
