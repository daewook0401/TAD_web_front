import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { analysisAPI } from '../api/analysisAPI';
import { boardAPI } from '../api/boardAPI';
import { useAuth } from '../provider/AuthContext';
import '../styles/pages/AdminPage.css';

const reviewStatusOptions = [
  { key: 'ALL', label: '전체' },
  { key: 'PROCESSING', label: '준비중' },
  { key: 'DRAFT', label: '검수 필요' },
  { key: 'CONFIRMED', label: '확정 완료' },
  { key: 'FAILED', label: '분석 실패' },
];

const reportStatusOptions = [
  { key: 'ALL', label: '전체' },
  { key: 'PENDING', label: '대기' },
  { key: 'ACCEPTED', label: '접수' },
  { key: 'REJECTED', label: '반려' },
];

const adminTabs = [
  { key: 'reviews', label: '검수' },
  { key: 'reports', label: '신고' },
  { key: 'sanctions', label: '제재' },
];

const statusLabel = (status) => reviewStatusOptions.find((option) => option.key === status)?.label || status || '-';
const reportStatusLabel = (status) => reportStatusOptions.find((option) => option.key === status)?.label || status || '-';
const sanctionTypeLabel = (type) => {
  if (type === 'BANNED') return '영구 제한';
  if (type === 'SUSPENDED') return '일시 제한';
  return type || '-';
};
const targetTypeLabel = (type) => (type === 'COMMENT' ? '댓글' : '게시글');

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

const targetPath = (report) => {
  if (!report?.targetPostId) return null;
  if (report.targetCategoryKey) {
    return `/board/${report.targetCategoryKey}/post/${report.targetPostId}`;
  }
  return `/board/post/${report.targetPostId}`;
};

const AdminPage = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('reviews');
  const [records, setRecords] = useState([]);
  const [reports, setReports] = useState([]);
  const [sanctions, setSanctions] = useState([]);
  const [reviewStatusFilter, setReviewStatusFilter] = useState('ALL');
  const [reportStatusFilter, setReportStatusFilter] = useState('ALL');
  const [reviewSearchInput, setReviewSearchInput] = useState('');
  const [reviewKeyword, setReviewKeyword] = useState('');
  const [sanctionUserInput, setSanctionUserInput] = useState('');
  const [sanctionUserId, setSanctionUserId] = useState(null);
  const [activeOnly, setActiveOnly] = useState(false);
  const [sanctionForm, setSanctionForm] = useState({
    userId: '',
    sanctionType: 'SUSPENDED',
    sanctionDays: 7,
    reason: '',
  });
  const [loadingState, setLoadingState] = useState({
    reviews: true,
    reports: false,
    sanctions: false,
  });
  const [workingId, setWorkingId] = useState(null);
  const [isSubmittingSanction, setIsSubmittingSanction] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const fetchRecords = useCallback(async () => {
    setLoadingState((prev) => ({ ...prev, reviews: true }));
    setErrorMessage('');

    try {
      const response = await analysisAPI.getAdminRecords({
        status: reviewStatusFilter === 'ALL' ? undefined : reviewStatusFilter,
        keyword: reviewKeyword || undefined,
        limit: 150,
      });
      setRecords(response.data ?? []);
    } catch (error) {
      setErrorMessage(error.response?.data?.message || '관리자 검수 목록을 불러오지 못했습니다.');
    } finally {
      setLoadingState((prev) => ({ ...prev, reviews: false }));
    }
  }, [reviewKeyword, reviewStatusFilter]);

  const fetchReports = useCallback(async () => {
    setLoadingState((prev) => ({ ...prev, reports: true }));
    setErrorMessage('');

    try {
      const response = await boardAPI.getAdminReports({
        status: reportStatusFilter === 'ALL' ? undefined : reportStatusFilter,
        limit: 200,
      });
      setReports(response.data ?? []);
    } catch (error) {
      setErrorMessage(error.response?.data?.message || '신고 목록을 불러오지 못했습니다.');
    } finally {
      setLoadingState((prev) => ({ ...prev, reports: false }));
    }
  }, [reportStatusFilter]);

  const fetchSanctions = useCallback(async () => {
    setLoadingState((prev) => ({ ...prev, sanctions: true }));
    setErrorMessage('');

    try {
      const response = await boardAPI.getAdminSanctions({
        userId: sanctionUserId || undefined,
        activeOnly,
        limit: 200,
      });
      setSanctions(response.data ?? []);
    } catch (error) {
      setErrorMessage(error.response?.data?.message || '제재 목록을 불러오지 못했습니다.');
    } finally {
      setLoadingState((prev) => ({ ...prev, sanctions: false }));
    }
  }, [activeOnly, sanctionUserId]);

  useEffect(() => {
    fetchRecords();
  }, [fetchRecords]);

  useEffect(() => {
    if (activeTab === 'reports') {
      fetchReports();
    }
  }, [activeTab, fetchReports]);

  useEffect(() => {
    if (activeTab === 'sanctions') {
      fetchSanctions();
    }
  }, [activeTab, fetchSanctions]);

  const reviewStats = useMemo(() => {
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

  const reportStats = useMemo(() => reports.reduce((acc, report) => {
    acc.total += 1;
    if (report.status === 'PENDING') acc.pending += 1;
    if (report.status === 'ACCEPTED') acc.accepted += 1;
    if (report.status === 'REJECTED') acc.rejected += 1;
    if (report.reportedUserId) acc.reportedUsers.add(report.reportedUserId);
    return acc;
  }, {
    total: 0,
    pending: 0,
    accepted: 0,
    rejected: 0,
    reportedUsers: new Set(),
  }), [reports]);

  const sanctionStats = useMemo(() => sanctions.reduce((acc, sanction) => {
    acc.total += 1;
    if (sanction.active) acc.active += 1;
    if (sanction.sanctionType === 'SUSPENDED') acc.suspended += 1;
    if (sanction.sanctionType === 'BANNED') acc.banned += 1;
    if (sanction.revokedAt) acc.revoked += 1;
    return acc;
  }, {
    total: 0,
    active: 0,
    suspended: 0,
    banned: 0,
    revoked: 0,
  }), [sanctions]);

  const handleReviewSearch = (event) => {
    event.preventDefault();
    setReviewKeyword(reviewSearchInput.trim());
  };

  const handleSanctionSearch = (event) => {
    event.preventDefault();
    const normalized = sanctionUserInput.trim();
    if (!normalized) {
      setSanctionUserId(null);
      return;
    }

    const parsed = Number(normalized);
    if (Number.isNaN(parsed)) {
      window.alert('회원 ID는 숫자로 입력해주세요.');
      return;
    }

    setSanctionUserId(parsed);
  };

  const handleReport = async (report, status, withSanction = false) => {
    const handlerMemo = window.prompt(
      status === 'REJECTED' ? '반려 메모를 입력해주세요.' : '처리 메모를 입력해주세요.',
      status === 'REJECTED' ? '신고 사유 불충분' : '신고 내용 확인'
    );
    if (handlerMemo === null) return;

    let sanctionReason = null;
    if (withSanction) {
      sanctionReason = window.prompt('제재 사유를 입력해주세요.', report.reasonDetail || '게시판 신고 처리');
      if (sanctionReason === null) return;
      if (!sanctionReason.trim()) {
        window.alert('제재 사유를 입력해주세요.');
        return;
      }
    }

    setWorkingId(`report:${report.id}`);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      await boardAPI.handleAdminReport(report.id, {
        status,
        handlerMemo: handlerMemo.trim() || null,
        sanctionType: withSanction ? 'SUSPENDED' : undefined,
        sanctionDays: withSanction ? 7 : undefined,
        sanctionReason: sanctionReason?.trim(),
      });
      setSuccessMessage(withSanction ? '신고 처리와 7일 제재가 완료되었습니다.' : '신고 처리가 완료되었습니다.');
      await fetchReports();
      if (withSanction) {
        await fetchSanctions();
      }
    } catch (error) {
      setErrorMessage(error.response?.data?.message || '신고 처리에 실패했습니다.');
    } finally {
      setWorkingId(null);
    }
  };

  const handleSanctionFormChange = (field, value) => {
    setSanctionForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSanctionCreate = async (event) => {
    event.preventDefault();
    const userId = Number(sanctionForm.userId);
    const reason = sanctionForm.reason.trim();

    if (!userId || Number.isNaN(userId)) {
      window.alert('회원 ID를 입력해주세요.');
      return;
    }

    if (!reason) {
      window.alert('제재 사유를 입력해주세요.');
      return;
    }

    setIsSubmittingSanction(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      await boardAPI.createAdminSanction({
        userId,
        sanctionType: sanctionForm.sanctionType,
        sanctionDays: sanctionForm.sanctionType === 'SUSPENDED' ? Number(sanctionForm.sanctionDays) : undefined,
        reason,
      });
      setSuccessMessage('제재가 발급되었습니다.');
      setSanctionForm((prev) => ({ ...prev, userId: '', reason: '' }));
      await fetchSanctions();
    } catch (error) {
      setErrorMessage(error.response?.data?.message || '제재 발급에 실패했습니다.');
    } finally {
      setIsSubmittingSanction(false);
    }
  };

  const handleSanctionRevoke = async (sanction) => {
    const reason = window.prompt('제재 해제 사유를 입력해주세요.', '관리자 해제');
    if (reason === null) return;

    setWorkingId(`sanction:${sanction.id}`);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      await boardAPI.revokeAdminSanction(sanction.id, { reason: reason.trim() || null });
      setSuccessMessage('제재가 해제되었습니다.');
      await fetchSanctions();
    } catch (error) {
      setErrorMessage(error.response?.data?.message || '제재 해제에 실패했습니다.');
    } finally {
      setWorkingId(null);
    }
  };

  const renderStats = () => {
    if (activeTab === 'reports') {
      return (
        <section className="admin-page__stats" aria-label="신고 요약">
          <div className="admin-page__stat-card"><span>표시 신고</span><strong>{reportStats.total}</strong></div>
          <div className="admin-page__stat-card admin-page__stat-card--warning"><span>대기</span><strong>{reportStats.pending}</strong></div>
          <div className="admin-page__stat-card"><span>접수</span><strong>{reportStats.accepted}</strong></div>
          <div className="admin-page__stat-card"><span>반려</span><strong>{reportStats.rejected}</strong></div>
          <div className="admin-page__stat-card"><span>피신고 회원</span><strong>{reportStats.reportedUsers.size}</strong></div>
        </section>
      );
    }

    if (activeTab === 'sanctions') {
      return (
        <section className="admin-page__stats" aria-label="제재 요약">
          <div className="admin-page__stat-card"><span>표시 제재</span><strong>{sanctionStats.total}</strong></div>
          <div className="admin-page__stat-card admin-page__stat-card--warning"><span>활성</span><strong>{sanctionStats.active}</strong></div>
          <div className="admin-page__stat-card"><span>일시 제한</span><strong>{sanctionStats.suspended}</strong></div>
          <div className="admin-page__stat-card"><span>영구 제한</span><strong>{sanctionStats.banned}</strong></div>
          <div className="admin-page__stat-card"><span>해제</span><strong>{sanctionStats.revoked}</strong></div>
        </section>
      );
    }

    return (
      <section className="admin-page__stats" aria-label="관리자 검수 요약">
        <div className="admin-page__stat-card"><span>표시 기록</span><strong>{reviewStats.total}</strong></div>
        <div className="admin-page__stat-card"><span>준비중</span><strong>{reviewStats.processing}</strong></div>
        <div className="admin-page__stat-card admin-page__stat-card--warning"><span>검수 필요</span><strong>{reviewStats.draft}</strong></div>
        <div className="admin-page__stat-card"><span>확정 완료</span><strong>{reviewStats.confirmed}</strong></div>
        <div className="admin-page__stat-card admin-page__stat-card--warning"><span>분석 실패</span><strong>{reviewStats.failed}</strong></div>
      </section>
    );
  };

  const renderReviews = () => (
    <>
      <section className="admin-page__toolbar">
        <div className="admin-page__filters" aria-label="상태 필터">
          {reviewStatusOptions.map((option) => (
            <button
              key={option.key}
              type="button"
              className={`admin-page__filter ${reviewStatusFilter === option.key ? 'admin-page__filter--active' : ''}`}
              onClick={() => setReviewStatusFilter(option.key)}
            >
              {option.label}
            </button>
          ))}
        </div>
        <form className="admin-page__search" onSubmit={handleReviewSearch}>
          <input
            value={reviewSearchInput}
            onChange={(event) => setReviewSearchInput(event.target.value)}
            placeholder="게임 번호, 닉네임, 이메일"
          />
          <button type="submit">검색</button>
        </form>
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
              {!loadingState.reviews && records.length > 0 ? records.map((record) => (
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
                    {loadingState.reviews ? '관리자 검수 목록을 불러오는 중입니다.' : '표시할 검수 기록이 없습니다.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );

  const renderReports = () => (
    <>
      <section className="admin-page__toolbar">
        <div className="admin-page__filters" aria-label="신고 상태 필터">
          {reportStatusOptions.map((option) => (
            <button
              key={option.key}
              type="button"
              className={`admin-page__filter ${reportStatusFilter === option.key ? 'admin-page__filter--active' : ''}`}
              onClick={() => setReportStatusFilter(option.key)}
            >
              {option.label}
            </button>
          ))}
        </div>
        <Link to="/board" className="admin-page__link">게시판 열기</Link>
      </section>

      <section className="admin-page__table-card">
        <div className="admin-page__table-wrap">
          <table className="admin-page__table admin-page__table--wide">
            <thead>
              <tr>
                <th>대상</th>
                <th>신고자</th>
                <th>피신고자</th>
                <th>사유</th>
                <th>상태</th>
                <th>접수</th>
                <th>처리</th>
              </tr>
            </thead>
            <tbody>
              {!loadingState.reports && reports.length > 0 ? reports.map((report) => {
                const path = targetPath(report);
                const isWorking = workingId === `report:${report.id}`;
                return (
                  <tr key={report.id}>
                    <td>
                      <strong>{targetTypeLabel(report.targetType)} #{report.targetId}</strong>
                      <span>{report.targetTitle || '-'}</span>
                      {path && <Link to={path} className="admin-page__sub-link">대상 열기</Link>}
                    </td>
                    <td>
                      <strong>{report.reporterNickname || '-'}</strong>
                      <span>{report.reporterEmail || '-'}</span>
                    </td>
                    <td>
                      <strong>{report.reportedUserNickname || '-'}</strong>
                      <span>#{report.reportedUserId || '-'}</span>
                    </td>
                    <td>
                      <strong>{report.reasonCode || '-'}</strong>
                      <span>{report.reasonDetail || '-'}</span>
                    </td>
                    <td>
                      <span className={`admin-page__status admin-page__status--${report.status?.toLowerCase() || 'default'}`}>
                        {reportStatusLabel(report.status)}
                      </span>
                    </td>
                    <td>{formatDateTime(report.createdAt)}</td>
                    <td>
                      {report.status === 'PENDING' ? (
                        <div className="admin-page__row-actions">
                          <button type="button" onClick={() => handleReport(report, 'ACCEPTED')} disabled={isWorking}>
                            접수
                          </button>
                          <button type="button" onClick={() => handleReport(report, 'ACCEPTED', true)} disabled={isWorking}>
                            7일 제재
                          </button>
                          <button type="button" className="admin-page__danger" onClick={() => handleReport(report, 'REJECTED')} disabled={isWorking}>
                            반려
                          </button>
                        </div>
                      ) : (
                        <span className="admin-page__muted">{report.handledByNickname || '-'} / {formatDateTime(report.handledAt)}</span>
                      )}
                    </td>
                  </tr>
                );
              }) : (
                <tr>
                  <td colSpan="7" className="admin-page__empty">
                    {loadingState.reports ? '신고 목록을 불러오는 중입니다.' : '표시할 신고가 없습니다.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );

  const renderSanctions = () => (
    <>
      <section className="admin-page__panel">
        <form className="admin-page__inline-form" onSubmit={handleSanctionCreate}>
          <input
            value={sanctionForm.userId}
            onChange={(event) => handleSanctionFormChange('userId', event.target.value)}
            placeholder="회원 ID"
            inputMode="numeric"
          />
          <select
            value={sanctionForm.sanctionType}
            onChange={(event) => handleSanctionFormChange('sanctionType', event.target.value)}
          >
            <option value="SUSPENDED">일시 제한</option>
            <option value="BANNED">영구 제한</option>
          </select>
          {sanctionForm.sanctionType === 'SUSPENDED' && (
            <input
              value={sanctionForm.sanctionDays}
              onChange={(event) => handleSanctionFormChange('sanctionDays', event.target.value)}
              placeholder="일수"
              inputMode="numeric"
            />
          )}
          <input
            value={sanctionForm.reason}
            onChange={(event) => handleSanctionFormChange('reason', event.target.value)}
            placeholder="제재 사유"
          />
          <button type="submit" disabled={isSubmittingSanction}>
            {isSubmittingSanction ? '발급 중...' : '제재 발급'}
          </button>
        </form>
      </section>

      <section className="admin-page__toolbar">
        <form className="admin-page__search" onSubmit={handleSanctionSearch}>
          <input
            value={sanctionUserInput}
            onChange={(event) => setSanctionUserInput(event.target.value)}
            placeholder="회원 ID"
            inputMode="numeric"
          />
          <button type="submit">검색</button>
        </form>
        <label className="admin-page__checkbox">
          <input type="checkbox" checked={activeOnly} onChange={(event) => setActiveOnly(event.target.checked)} />
          활성 제재만
        </label>
      </section>

      <section className="admin-page__table-card">
        <div className="admin-page__table-wrap">
          <table className="admin-page__table">
            <thead>
              <tr>
                <th>회원</th>
                <th>유형</th>
                <th>사유</th>
                <th>기간</th>
                <th>상태</th>
                <th>처리</th>
              </tr>
            </thead>
            <tbody>
              {!loadingState.sanctions && sanctions.length > 0 ? sanctions.map((sanction) => {
                const isWorking = workingId === `sanction:${sanction.id}`;
                return (
                  <tr key={sanction.id}>
                    <td>
                      <strong>{sanction.userNickname || '-'}</strong>
                      <span>{sanction.userEmail || `#${sanction.userId}`}</span>
                    </td>
                    <td>{sanctionTypeLabel(sanction.sanctionType)}</td>
                    <td>{sanction.reason || '-'}</td>
                    <td>
                      <strong>{formatDateTime(sanction.startsAt)}</strong>
                      <span>{sanction.expiresAt ? formatDateTime(sanction.expiresAt) : '무기한'}</span>
                    </td>
                    <td>
                      <span className={`admin-page__status admin-page__status--${sanction.active ? 'pending' : 'default'}`}>
                        {sanction.active ? '활성' : '비활성'}
                      </span>
                    </td>
                    <td>
                      {sanction.active ? (
                        <button
                          type="button"
                          className="admin-page__action-button"
                          onClick={() => handleSanctionRevoke(sanction)}
                          disabled={isWorking}
                        >
                          해제
                        </button>
                      ) : (
                        <span className="admin-page__muted">{formatDateTime(sanction.revokedAt)}</span>
                      )}
                    </td>
                  </tr>
                );
              }) : (
                <tr>
                  <td colSpan="6" className="admin-page__empty">
                    {loadingState.sanctions ? '제재 목록을 불러오는 중입니다.' : '표시할 제재가 없습니다.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );

  return (
    <div className="admin-page">
      <div className="admin-page__container">
        <header className="admin-page__header">
          <div>
            <p className="admin-page__eyebrow">Admin Console</p>
            <h1 className="admin-page__title">관리자 운영</h1>
          </div>
          <div className="admin-page__operator">
            <span>관리자</span>
            <strong>{user?.nickname || user?.email || 'Admin'}</strong>
          </div>
        </header>

        <nav className="admin-page__tabs" aria-label="관리자 메뉴">
          {adminTabs.map((tab) => (
            <button
              key={tab.key}
              type="button"
              className={`admin-page__tab ${activeTab === tab.key ? 'admin-page__tab--active' : ''}`}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.label}
            </button>
          ))}
        </nav>

        {errorMessage && (
          <div className="admin-page__message admin-page__message--error">
            <p>{errorMessage}</p>
          </div>
        )}
        {successMessage && (
          <div className="admin-page__message admin-page__message--success">
            <p>{successMessage}</p>
          </div>
        )}

        {renderStats()}
        {activeTab === 'reviews' && renderReviews()}
        {activeTab === 'reports' && renderReports()}
        {activeTab === 'sanctions' && renderSanctions()}
      </div>
    </div>
  );
};

export default AdminPage;
