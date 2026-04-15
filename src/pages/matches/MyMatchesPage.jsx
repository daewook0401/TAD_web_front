import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { analysisAPI } from '../../api/analysisAPI';
import { useAuth } from '../../provider/AuthContext';
import '../../styles/pages/MatchesPages.css';

const MyMatchesPage = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [records, setRecords] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  const fetchRecords = useCallback(async (showLoading = false) => {
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
      if (showLoading) {
        setIsLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { replace: true });
      return;
    }

    fetchRecords(true);
  }, [fetchRecords, isAuthenticated, navigate]);

  useEffect(() => {
    const hasProcessing = records.some((record) => record.status === 'PROCESSING');
    if (!hasProcessing) {
      return undefined;
    }

    const intervalId = window.setInterval(() => {
      fetchRecords(false);
    }, 5000);

    return () => window.clearInterval(intervalId);
  }, [fetchRecords, records]);

  const stats = useMemo(() => {
    const confirmed = records.filter((record) => record.status === 'CONFIRMED');
    const drafts = records.filter((record) => record.status === 'DRAFT').length;
    const processing = records.filter((record) => record.status === 'PROCESSING').length;

    return {
      totalMatches: records.length,
      confirmedMatches: confirmed.length,
      drafts,
      processing,
    };
  }, [records]);

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
    if (status === 'CONFIRMED') {
      return 'matches-table__result--win';
    }
    return 'matches-table__result--loss';
  };

  if (!isAuthenticated) {
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
              업로드한 내전 기록이 준비중인지, 검수 가능한지, 최종 확정됐는지 한눈에 확인할 수 있습니다.
            </p>
            <Link to="/matches/upload" className="match-upload__cta">
              새 내전 기록 업로드
            </Link>
          </div>
          <div className="matches-hero__user">
            <p className="matches-hero__user-label">소환사</p>
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
            <p className="my-stats__value">{records.reduce((sum, record) => sum + (record.recognizedPlayers ?? 0), 0)}</p>
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
                  <th className="matches-table__th">업로드 시각</th>
                  <th className="matches-table__th">상태</th>
                  <th className="matches-table__th">승리 팀</th>
                  <th className="matches-table__th">인식 플레이어</th>
                  <th className="matches-table__th">확인</th>
                </tr>
              </thead>
              <tbody>
                {!isLoading && records.length > 0 ? (
                  records.map((record) => (
                    <tr key={record.gameNumber} className="matches-table__row">
                      <td className="matches-table__td matches-table__td--name">{record.gameNumber}</td>
                      <td className="matches-table__td">{record.createdAt ?? '-'}</td>
                      <td className="matches-table__td">
                        <span className={`matches-table__result ${getStatusClassName(record.status)}`}>
                          {getStatusLabel(record.status)}
                        </span>
                      </td>
                      <td className="matches-table__td">
                        {record.winner === 'team1' ? '1팀' : record.winner === 'team2' ? '2팀' : '-'}
                      </td>
                      <td className="matches-table__td">{record.recognizedPlayers ?? 0}</td>
                      <td className="matches-table__td">
                        {record.status === 'DRAFT' || record.status === 'CONFIRMED' ? (
                          <Link to={`/matches/review/${record.gameNumber}`} className="match-upload__link">
                            {record.status === 'DRAFT' ? '검수하기' : '상세 보기'}
                          </Link>
                        ) : (
                          <span className="match-review__hint">
                            {record.status === 'PROCESSING' ? '분석 중' : '확인 불가'}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="matches-table__empty">
                      {isLoading ? '업로드한 내전 기록을 불러오는 중입니다.' : '아직 업로드된 내전 기록이 없습니다.'}
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
