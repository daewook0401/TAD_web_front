import React, { useEffect, useMemo, useState } from 'react';
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

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { replace: true });
      return;
    }

    const fetchRecords = async () => {
      setIsLoading(true);
      setErrorMessage('');

      try {
        const response = await analysisAPI.getMyRecords();
        setRecords(response.data);
      } catch (error) {
        setErrorMessage(error.response?.data?.message || '내 전적 목록을 불러오지 못했습니다.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecords();
  }, [isAuthenticated, navigate]);

  const stats = useMemo(() => {
    const confirmed = records.filter((record) => record.status === 'CONFIRMED');
    const wins = confirmed.filter((record) => record.winner === 'team1' || record.winner === 'team2').length;
    const drafts = records.filter((record) => record.reviewRequired).length;

    return {
      totalMatches: records.length,
      confirmedMatches: confirmed.length,
      drafts,
      wins,
    };
  }, [records]);

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
              업로드가 끝난 내전 기록을 확인하고, 검수 필요 상태라면 이름 수정 후 최종 확정할 수 있습니다.
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
            <p className="my-stats__label">확정 완료</p>
            <p className="my-stats__value my-stats__value--win">{stats.confirmedMatches}</p>
          </div>
          <div className="my-stats__card">
            <p className="my-stats__label">검수 필요</p>
            <p className="my-stats__value my-stats__value--loss">{stats.drafts}</p>
          </div>
          <div className="my-stats__card">
            <p className="my-stats__label">인식된 기록</p>
            <p className="my-stats__value">{records.reduce((sum, record) => sum + (record.recognizedPlayers ?? 0), 0)}</p>
          </div>
          <div className="my-stats__card">
            <p className="my-stats__label">업로드 이미지</p>
            <p className="my-stats__value">{records.length}</p>
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
                        <span className={`matches-table__result ${record.reviewRequired ? 'matches-table__result--loss' : 'matches-table__result--win'}`}>
                          {record.reviewRequired ? '검수 필요' : '확정 완료'}
                        </span>
                      </td>
                      <td className="matches-table__td">{record.winner === 'team1' ? '1팀' : '2팀'}</td>
                      <td className="matches-table__td">{record.recognizedPlayers ?? 0}</td>
                      <td className="matches-table__td">
                        <Link to={`/matches/review/${record.gameNumber}`} className="match-upload__link">
                          {record.reviewRequired ? '검수하기' : '상세 보기'}
                        </Link>
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
