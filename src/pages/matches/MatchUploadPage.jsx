import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { analysisAPI } from '../../api/analysisAPI';
import { useAuth } from '../../provider/AuthContext';
import '../../styles/pages/MatchesPages.css';

const MatchUploadPage = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
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

  if (!isAuthenticated) {
    return null;
  }

  const handleFileChange = (event) => {
    const file = event.target.files?.[0] ?? null;

    setSelectedFile(file);
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
      navigate('/matches/my', {
        replace: true,
        state: {
          message: `게임 #${response.data.gameNumber} 업로드가 완료되었습니다. 준비중 상태에서 분석이 끝나면 검수할 수 있습니다.`,
        },
      });
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message || '전적 업로드 중 문제가 발생했습니다. 잠시 후 다시 시도해주세요.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="matches-page">
      <section className="matches-hero">
        <div className="matches-hero__container matches-hero__container--split">
          <div>
            <span className="matches-hero__eyebrow">Scrim Upload</span>
            <h1 className="matches-hero__title">내전 기록 등록</h1>
            <p className="matches-hero__description">
              경기 결과 이미지를 올리면 바로 내 전적 확인으로 이동하고, 분석이 끝나면 검수 후 최종 확정할 수 있습니다.
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
              <span className="match-upload__badge">빠른 등록</span>
              <h2 className="match-upload__title">스크린샷 업로드</h2>
              <p className="match-upload__description">
                업로드 직후에는 준비중 상태로 보이고, 분석이 완료되면 내 전적 확인에서 이름과 수치를 검수할 수 있습니다.
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
                {isSubmitting ? '등록 중...' : '내전 기록 등록'}
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default MatchUploadPage;
