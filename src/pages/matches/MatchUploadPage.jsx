import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { analysisAPI } from '../../api/analysisAPI';
import { useAuth } from '../../provider/AuthContext';
import '../../styles/pages/MatchesPages.css';

const MatchUploadPage = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [result, setResult] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const summary = useMemo(() => {
    if (!result) {
      return null;
    }

    const allPlayers = [...(result.team1?.players ?? []), ...(result.team2?.players ?? [])];

    return {
      recognizedPlayers: allPlayers.filter((player) => Boolean(player?.name)).length,
      winnerLabel: result.winner === 'team1' ? '1팀' : '2팀',
    };
  }, [result]);

  if (!isAuthenticated) {
    return null;
  }

  const handleFileChange = (event) => {
    const file = event.target.files?.[0] ?? null;

    setSelectedFile(file);
    setResult(null);
    setErrorMessage('');

    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    if (!file) {
      setPreviewUrl('');
      return;
    }

    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!selectedFile) {
      setErrorMessage('업로드할 스크린샷을 선택해주세요.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const response = await analysisAPI.uploadMatchRecord(selectedFile);
      setResult(response.data);
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message || '전적 업로드 중 문제가 발생했습니다. 잠시 후 다시 시도해주세요.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderPlayerRows = (players = []) =>
    players.map((player, index) => {
      const kda =
        [player?.kills, player?.deaths, player?.assists].every((value) => value !== null && value !== undefined)
          ? `${player.kills} / ${player.deaths} / ${player.assists}`
          : '-';

      return (
        <tr key={`${player?.slotNumber ?? index + 1}-${player?.name ?? 'empty'}`} className="matches-table__row">
          <td className="matches-table__td">{player?.slotNumber ?? index + 1}</td>
          <td className="matches-table__td matches-table__td--name">{player?.name || '미인식'}</td>
          <td className="matches-table__td matches-table__td--kda">{kda}</td>
          <td className="matches-table__td">{player?.cs ?? '-'}</td>
          <td className="matches-table__td">{player?.gold ?? '-'}</td>
          <td className="matches-table__td">
            <span className={`matches-table__result ${player?.winner ? 'matches-table__result--win' : 'matches-table__result--loss'}`}>
              {player?.winner ? '승리' : '패배'}
            </span>
          </td>
        </tr>
      );
    });

  return (
    <div className="matches-page">
      <section className="matches-hero">
        <div className="matches-hero__container matches-hero__container--split">
          <div>
            <span className="matches-hero__eyebrow">Scrim Upload</span>
            <h1 className="matches-hero__title">내전 기록 등록</h1>
            <p className="matches-hero__description">
              경기 결과 스크린샷을 올리면 분석 서버 호출과 DB 저장까지 한 번에 처리됩니다.
            </p>
          </div>
          <div className="matches-hero__user">
            <p className="matches-hero__user-label">등록자</p>
            <p className="matches-hero__user-name">{user?.nickname || user?.email || '사용자'}</p>
          </div>
        </div>
      </section>

      <section className="match-upload">
        <div className="match-upload__container">
          <div className="match-upload__panel">
            <div className="match-upload__intro">
              <span className="match-upload__badge">자동 저장</span>
              <h2 className="match-upload__title">스크린샷 업로드</h2>
              <p className="match-upload__description">
                로그인한 사용자만 등록할 수 있으며, 업로드한 이미지는 MinIO에 저장된 뒤 분석 결과와 함께 게임 기록으로 남습니다.
              </p>
            </div>

            <form className="match-upload__form" onSubmit={handleSubmit}>
              <label className="match-upload__dropzone">
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/jpg,image/webp"
                  className="match-upload__input"
                  onChange={handleFileChange}
                />
                <span className="match-upload__drop-title">
                  {selectedFile ? selectedFile.name : '업로드할 내전 결과 이미지를 선택하세요'}
                </span>
                <span className="match-upload__drop-help">
                  PNG, JPG, WEBP 이미지를 지원합니다.
                </span>
              </label>

              {previewUrl && (
                <div className="match-upload__preview-card">
                  <img src={previewUrl} alt="전적 업로드 미리보기" className="match-upload__preview-image" />
                </div>
              )}

              {errorMessage && <p className="match-upload__error">{errorMessage}</p>}

              <button type="submit" className="match-upload__submit" disabled={isSubmitting}>
                {isSubmitting ? '업로드 중...' : '내전 기록 등록'}
              </button>
            </form>
          </div>

          <aside className="match-upload__sidecard">
            <h3 className="match-upload__side-title">처리 순서</h3>
            <ol className="match-upload__steps">
              <li>프론트에서 스크린샷 업로드</li>
              <li>백엔드에서 MinIO 저장</li>
              <li>분석 서버에 bucket/object_key 전달</li>
              <li>게임, 플레이어, 전적 통계 저장</li>
            </ol>
          </aside>
        </div>
      </section>

      {result && (
        <>
          <section className="my-stats">
            <div className="my-stats__grid">
              <div className="my-stats__card">
                <p className="my-stats__label">게임 번호</p>
                <p className="my-stats__value">{result.gameNumber}</p>
              </div>
              <div className="my-stats__card">
                <p className="my-stats__label">승리 팀</p>
                <p className="my-stats__value my-stats__value--win">{summary?.winnerLabel}</p>
              </div>
              <div className="my-stats__card">
                <p className="my-stats__label">인식 플레이어</p>
                <p className="my-stats__value">{summary?.recognizedPlayers ?? 0}</p>
              </div>
              <div className="my-stats__card">
                <p className="my-stats__label">버킷</p>
                <p className="my-stats__value match-upload__stat-text">{result.bucket}</p>
              </div>
              <div className="my-stats__card">
                <p className="my-stats__label">오브젝트 키</p>
                <p className="my-stats__value match-upload__stat-text">{result.objectKey}</p>
              </div>
            </div>
          </section>

          <section className="matches-table">
            <div className="matches-table__container">
              <div className="match-upload__result-header">
                <div>
                  <span className="matches-hero__eyebrow">Upload Result</span>
                  <h2 className="match-upload__result-title">분석 결과</h2>
                </div>
                {result.screenshotUrl && (
                  <a href={result.screenshotUrl} target="_blank" rel="noreferrer" className="match-upload__link">
                    저장된 이미지 보기
                  </a>
                )}
              </div>

              <div className="match-upload__teams">
                <div className="matches-table__wrapper">
                  <div className="match-upload__team-head">
                    <h3>1팀</h3>
                    <span className={`matches-table__result ${result.winner === 'team1' ? 'matches-table__result--win' : 'matches-table__result--loss'}`}>
                      {result.winner === 'team1' ? '승리' : '패배'}
                    </span>
                  </div>
                  <table className="matches-table__table">
                    <thead>
                      <tr className="matches-table__header-row">
                        <th className="matches-table__th">슬롯</th>
                        <th className="matches-table__th">플레이어</th>
                        <th className="matches-table__th">K / D / A</th>
                        <th className="matches-table__th">CS</th>
                        <th className="matches-table__th">Gold</th>
                        <th className="matches-table__th">결과</th>
                      </tr>
                    </thead>
                    <tbody>{renderPlayerRows(result.team1?.players)}</tbody>
                  </table>
                </div>

                <div className="matches-table__wrapper">
                  <div className="match-upload__team-head">
                    <h3>2팀</h3>
                    <span className={`matches-table__result ${result.winner === 'team2' ? 'matches-table__result--win' : 'matches-table__result--loss'}`}>
                      {result.winner === 'team2' ? '승리' : '패배'}
                    </span>
                  </div>
                  <table className="matches-table__table">
                    <thead>
                      <tr className="matches-table__header-row">
                        <th className="matches-table__th">슬롯</th>
                        <th className="matches-table__th">플레이어</th>
                        <th className="matches-table__th">K / D / A</th>
                        <th className="matches-table__th">CS</th>
                        <th className="matches-table__th">Gold</th>
                        <th className="matches-table__th">결과</th>
                      </tr>
                    </thead>
                    <tbody>{renderPlayerRows(result.team2?.players)}</tbody>
                  </table>
                </div>
              </div>
            </div>
          </section>
        </>
      )}
    </div>
  );
};

export default MatchUploadPage;
