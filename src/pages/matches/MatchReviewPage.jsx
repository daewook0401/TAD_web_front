import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { analysisAPI } from '../../api/analysisAPI';
import { useAuth } from '../../provider/AuthContext';
import '../../styles/pages/MatchesPages.css';

const createEmptyRecord = () => ({
  gameNumber: null,
  winner: 'team1',
  status: 'DRAFT',
  team1: { players: [] },
  team2: { players: [] },
});

const MatchReviewPage = () => {
  const { isAuthenticated } = useAuth();
  const { gameId } = useParams();
  const navigate = useNavigate();
  const [record, setRecord] = useState(createEmptyRecord);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [statusMessage, setStatusMessage] = useState('');

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { replace: true });
      return;
    }

    const fetchRecord = async () => {
      setIsLoading(true);
      setErrorMessage('');

      try {
        const response = await analysisAPI.getRecordDetail(gameId);
        setRecord(response.data);
      } catch (error) {
        setErrorMessage(error.response?.data?.message || '검수할 내전 기록을 불러오지 못했습니다.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecord();
  }, [gameId, isAuthenticated, navigate]);

  const isDraft = record.status === 'DRAFT';
  const isProcessing = record.status === 'PROCESSING';
  const isFailed = record.status === 'FAILED';

  const summary = useMemo(() => {
    const allPlayers = [...(record.team1?.players ?? []), ...(record.team2?.players ?? [])];
    return allPlayers.filter((player) => player?.name?.trim()).length;
  }, [record]);

  const updatePlayer = (teamKey, playerIndex, field, value) => {
    setRecord((current) => {
      const team = current[teamKey];
      const nextPlayers = [...(team?.players ?? [])];
      const currentPlayer = nextPlayers[playerIndex] ?? {};

      nextPlayers[playerIndex] = {
        ...currentPlayer,
        [field]: ['kills', 'deaths', 'assists', 'cs', 'gold', 'slotNumber'].includes(field)
          ? (value === '' ? null : Number(value))
          : value,
      };

      return {
        ...current,
        [teamKey]: {
          ...team,
          players: nextPlayers,
        },
      };
    });
  };

  const buildDraftPayload = () => ({
    winner: record.winner,
    team1: {
      players: (record.team1?.players ?? []).map((player, index) => ({
        slotNumber: player.slotNumber ?? index + 1,
        name: player.name ?? null,
        kills: player.kills,
        deaths: player.deaths,
        assists: player.assists,
        cs: player.cs,
        gold: player.gold,
      })),
    },
    team2: {
      players: (record.team2?.players ?? []).map((player, index) => ({
        slotNumber: player.slotNumber ?? index + 1,
        name: player.name ?? null,
        kills: player.kills,
        deaths: player.deaths,
        assists: player.assists,
        cs: player.cs,
        gold: player.gold,
      })),
    },
  });

  const handleSave = async () => {
    setIsSaving(true);
    setErrorMessage('');
    setStatusMessage('');

    try {
      const response = await analysisAPI.updateDraft(gameId, buildDraftPayload());
      setRecord(response.data);
      setStatusMessage('수정사항이 저장되었습니다. 이상 없으면 최종 확정해주세요.');
    } catch (error) {
      setErrorMessage(error.response?.data?.message || '검수 내용 저장에 실패했습니다.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleConfirm = async () => {
    setIsConfirming(true);
    setErrorMessage('');
    setStatusMessage('');

    try {
      await analysisAPI.updateDraft(gameId, buildDraftPayload());
      const response = await analysisAPI.confirmDraft(gameId);
      setRecord(response.data);
      setStatusMessage('내전 기록이 최종 확정되었습니다.');
    } catch (error) {
      setErrorMessage(error.response?.data?.message || '내전 기록 확정에 실패했습니다.');
    } finally {
      setIsConfirming(false);
    }
  };

  const renderEditableTeam = (teamKey, teamLabel) => (
    <div className="matches-table__wrapper">
      <div className="match-upload__team-head">
        <h3>{teamLabel}</h3>
        <label className="match-review__winner-toggle">
          <input
            type="radio"
            name="winner"
            checked={record.winner === teamKey}
            onChange={() => setRecord((current) => ({ ...current, winner: teamKey }))}
            disabled={!isDraft}
          />
          승리 팀
        </label>
      </div>
      <table className="matches-table__table">
        <thead>
          <tr className="matches-table__header-row">
            <th className="matches-table__th">슬롯</th>
            <th className="matches-table__th">플레이어 이름</th>
            <th className="matches-table__th">킬</th>
            <th className="matches-table__th">데스</th>
            <th className="matches-table__th">어시스트</th>
            <th className="matches-table__th">CS</th>
            <th className="matches-table__th">Gold</th>
          </tr>
        </thead>
        <tbody>
          {(record[teamKey]?.players ?? []).map((player, index) => (
            <tr key={`${teamKey}-${player.slotNumber ?? index + 1}`} className="matches-table__row">
              <td className="matches-table__td">{player.slotNumber ?? index + 1}</td>
              <td className="matches-table__td">
                <input
                  className="match-review__input match-review__input--name"
                  value={player.name ?? ''}
                  onChange={(event) => updatePlayer(teamKey, index, 'name', event.target.value)}
                  disabled={!isDraft}
                />
              </td>
              {['kills', 'deaths', 'assists', 'cs', 'gold'].map((field) => (
                <td key={field} className="matches-table__td">
                  <input
                    type="number"
                    className="match-review__input"
                    value={player[field] ?? ''}
                    onChange={(event) => updatePlayer(teamKey, index, field, event.target.value)}
                    disabled={!isDraft}
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  if (!isAuthenticated) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="matches-page">
        <section className="matches-results">
          <div className="matches-results__container">
            <div className="matches-empty">
              <h3 className="matches-empty__title">내전 기록을 불러오는 중입니다.</h3>
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
            <span className="matches-hero__eyebrow">Review Draft</span>
            <h1 className="matches-hero__title">내전 기록 검수</h1>
            <p className="matches-hero__description">
              업로드된 전적의 이름과 수치를 확인하고, 수정이 끝나면 최종 확정해주세요.
            </p>
          </div>
          <div className="matches-hero__user">
            <p className="matches-hero__user-label">게임 번호</p>
            <p className="matches-hero__user-name">{record.gameNumber}</p>
          </div>
        </div>
      </section>

      <section className="my-stats">
        <div className="my-stats__grid">
          <div className="my-stats__card">
            <p className="my-stats__label">상태</p>
            <p className="my-stats__value">{record.status}</p>
          </div>
          <div className="my-stats__card">
            <p className="my-stats__label">현재 승리 팀</p>
            <p className="my-stats__value my-stats__value--win">{record.winner === 'team1' ? '1팀' : '2팀'}</p>
          </div>
          <div className="my-stats__card">
            <p className="my-stats__label">인식 플레이어</p>
            <p className="my-stats__value">{summary}</p>
          </div>
          <div className="my-stats__card">
            <p className="my-stats__label">업로드 일시</p>
            <p className="my-stats__value match-upload__stat-text">{record.createdAt ?? '-'}</p>
          </div>
          <div className="my-stats__card">
            <p className="my-stats__label">이미지</p>
            <a href={record.screenshotUrl} target="_blank" rel="noreferrer" className="match-upload__link">
              보기
            </a>
          </div>
        </div>
      </section>

      <section className="matches-table">
        <div className="matches-table__container">
          {isProcessing && <p className="match-upload__status">아직 분석 중입니다. 내 전적 확인 화면에서 잠시 후 다시 확인해주세요.</p>}
          {isFailed && <p className="match-upload__error">분석 처리에 실패했습니다. 이미지를 다시 업로드해주세요.</p>}
          {statusMessage && <p className="match-upload__status">{statusMessage}</p>}
          {errorMessage && <p className="match-upload__error">{errorMessage}</p>}

          <div className="match-upload__teams">
            {renderEditableTeam('team1', '1팀')}
            {renderEditableTeam('team2', '2팀')}
          </div>

          <div className="match-review__actions">
            <Link to="/matches/my" className="match-review__secondary">
              내 전적 확인으로 돌아가기
            </Link>
            {isDraft && (
              <>
                <button className="match-review__secondary" onClick={handleSave} disabled={isSaving || isConfirming}>
                  {isSaving ? '저장 중...' : '수정 저장'}
                </button>
                <button className="match-upload__submit match-review__confirm" onClick={handleConfirm} disabled={isSaving || isConfirming}>
                  {isConfirming ? '최종 확정 중...' : '이상 없으니 최종 확정'}
                </button>
              </>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default MatchReviewPage;
