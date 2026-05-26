import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { analysisAPI } from '../api/analysisAPI';
import { useAuth } from '../provider/AuthContext';
import '../styles/pages/AdminPage.css';

const statusOptions = [
  { key: 'ALL', label: '전체' },
  { key: 'PROCESSING', label: '준비중' },
  { key: 'DRAFT', label: '검수 필요' },
  { key: 'CONFIRMED', label: '확정 완료' },
  { key: 'FAILED', label: '분석 실패' },
];

const statusLabel = (status) => statusOptions.find((option) => option.key === status)?.label || status || '-';
const winnerLabel = (winner) => {
  if (winner === 'team1') return '1팀';
  if (winner === 'team2') return '2팀';
  return '-';
};

const formatDateTime = (value) => {
  if (!value) return '-';

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '-';

  return date.toLocaleString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const AdminPage = () => {
  const { user } = useAuth();
  const [records, setRecords] = useState([]);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const fetchRecords = async () => {
      setIsLoading(true);
      setErrorMessage('');

      try {
        const response = await analysisAPI.getAdminRecords({
          status: statusFilter === 'ALL' ? undefined : statusFilter,
          limit: 150,
        });
        setRecords(response.data ?? []);
      } catch (error) {
        setErrorMessage(error.response?.data?.message || '관리자 검수 목록을 불러오지 못했습니다.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecords();
  }, [statusFilter]);

  const stats = useMemo(() => {
    const base = {
      total: records.length,
      processing: 0,
      draft: 0,
      confirmed: 0,
      failed: 0,
    };

    return records.reduce((acc, record) => {
      if (record.status === 'PROCESSING') acc.processing += 1;
      if (record.status === 'DRAFT') acc.draft += 1;
      if (record.status === 'CONFIRMED') acc.confirmed += 1;
      if (record.status === 'FAILED') acc.failed += 1;
      return acc;
    }, base);
  }, [records]);

  return (
    <div className="admin-page">
      <div className="admin-page__container">
        <header className="admin-page__header">
          <div>
            <p className="admin-page__eyebrow">Admin Review</p>
            <h1 className="admin-page__title">관리자 검수</h1>
          </div>
          <div className="admin-page__operator">
            <span>관리자</span>
            <strong>{user?.nickname || user?.email || 'Admin'}</strong>
          </div>
        </header>

        {errorMessage && (
          <div className="admin-page__message admin-page__message--error">
            <p>{errorMessage}</p>
          </div>
        )}

        <section className="admin-page__stats" aria-label="관리자 검수 요약">
          <div className="admin-page__stat-card">
            <span>표시 기록</span>
            <strong>{stats.total}</strong>
          </div>
          <div className="admin-page__stat-card">
            <span>준비중</span>
            <strong>{stats.processing}</strong>
          </div>
          <div className="admin-page__stat-card">
            <span>검수 필요</span>
            <strong>{stats.draft}</strong>
          </div>
          <div className="admin-page__stat-card">
            <span>확정 완료</span>
            <strong>{stats.confirmed}</strong>
          </div>
          <div className="admin-page__stat-card admin-page__stat-card--warning">
            <span>분석 실패</span>
            <strong>{stats.failed}</strong>
          </div>
        </section>

        <section className="admin-page__toolbar">
          <div className="admin-page__filters" aria-label="상태 필터">
            {statusOptions.map((option) => (
              <button
                key={option.key}
                type="button"
                className={`admin-page__filter ${statusFilter === option.key ? 'admin-page__filter--active' : ''}`}
                onClick={() => setStatusFilter(option.key)}
              >
                {option.label}
              </button>
            ))}
          </div>
          <Link to="/board" className="admin-page__link">게시판 관리</Link>
        </section>

        <section className="admin-page__table-card">
          <div className="admin-page__table-wrap">
            <table className="admin-page__table">
              <thead>
                <tr>
                  <th>게임</th>
                  <th>업로더</th>
                  <th>상태</th>
                  <th>승리 팀</th>
                  <th>인식</th>
                  <th>업로드</th>
                  <th>작업</th>
                </tr>
              </thead>
              <tbody>
                {!isLoading && records.length > 0 ? records.map((record) => (
                  <tr key={record.gameNumber}>
                    <td>#{record.gameNumber}</td>
                    <td>
                      <strong>{record.uploaderNickname || '-'}</strong>
                      <span>{record.uploaderEmail || '-'}</span>
                    </td>
                    <td>
                      <span className={`admin-page__status admin-page__status--${record.status?.toLowerCase() || 'default'}`}>
                        {statusLabel(record.status)}
                      </span>
                    </td>
                    <td>{winnerLabel(record.winner)}</td>
                    <td>{record.recognizedPlayers ?? 0}</td>
                    <td>{formatDateTime(record.createdAt)}</td>
                    <td>
                      {record.status === 'PROCESSING' || record.status === 'FAILED' ? (
                        <span className="admin-page__muted">대기</span>
                      ) : (
                        <Link to={`/matches/review/${record.gameNumber}`} className="admin-page__action">
                          검수 열기
                        </Link>
                      )}
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="7" className="admin-page__empty">
                      {isLoading ? '관리자 검수 목록을 불러오는 중입니다.' : '표시할 검수 기록이 없습니다.'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AdminPage;
