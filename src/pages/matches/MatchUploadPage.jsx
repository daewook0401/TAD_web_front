import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { analysisAPI } from '../../api/analysisAPI';
import { useAuth } from '../../provider/AuthContext';
import '../../styles/pages/MatchesPages.css';

const MAX_UPLOAD_SIZE = 100 * 1024 * 1024;
const SUPPORTED_IMAGE_TYPES = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];

const formatFileSize = (size) => {
  if (!size) return '-';
  const mb = size / (1024 * 1024);
  return `${mb >= 1 ? mb.toFixed(1) : (size / 1024).toFixed(0)}${mb >= 1 ? 'MB' : 'KB'}`;
};

const MatchUploadPage = () => {
  const { isAuthenticated, isLoading: isAuthLoading, user } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (isAuthLoading) {
      return;
    }

    if (!isAuthenticated) {
      navigate('/login', { replace: true });
    }
  }, [isAuthLoading, isAuthenticated, navigate]);

  useEffect(() => () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
  }, [previewUrl]);

  if (isAuthLoading || !isAuthenticated) {
    return null;
  }

  const validateFile = (file) => {
    if (!file) {
      return '';
    }

    if (!SUPPORTED_IMAGE_TYPES.includes(file.type)) {
      return 'PNG, JPG, WEBP 이미지 파일만 업로드할 수 있습니다.';
    }

    if (file.size > MAX_UPLOAD_SIZE) {
      return '100MB 이하의 이미지만 업로드할 수 있습니다.';
    }

    return '';
  };

  const applySelectedFile = (file) => {
    setErrorMessage('');

    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    if (!file) {
      setSelectedFile(null);
      setPreviewUrl('');
      return;
    }

    const validationMessage = validateFile(file);
    if (validationMessage) {
      setSelectedFile(null);
      setPreviewUrl('');
      setErrorMessage(validationMessage);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      return;
    }

    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleFileChange = (event) => {
    applySelectedFile(event.target.files?.[0] ?? null);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setIsDragging(false);
    applySelectedFile(event.dataTransfer.files?.[0] ?? null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!selectedFile) {
      setErrorMessage('업로드할 스크린샷을 선택해 주세요.');
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
      setErrorMessage(error.response?.data?.message || '전적 업로드 중 문제가 발생했습니다. 잠시 후 다시 시도해 주세요.');
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
                업로드 직후에는 준비중 상태로 보이고 분석이 완료되면 내 전적 확인에서 이름과 수치를 검수할 수 있습니다.
              </p>
            </div>

            <form className="match-upload__form" onSubmit={handleSubmit}>
              <label
                className={`match-upload__dropzone ${isDragging ? 'match-upload__dropzone--dragging' : ''}`}
                onDragOver={(event) => {
                  event.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/jpg,image/webp"
                  className="match-upload__input"
                  onChange={handleFileChange}
                />
                <span className="match-upload__drop-title">
                  {selectedFile ? selectedFile.name : '업로드할 내전 결과 이미지를 선택해 주세요'}
                </span>
                <span className="match-upload__drop-help">PNG, JPG, WEBP 이미지를 지원합니다.</span>
              </label>

              {previewUrl && (
                <div className="match-upload__preview-card">
                  <img src={previewUrl} alt="전적 업로드 미리보기" className="match-upload__preview-image" />
                </div>
              )}

              {selectedFile && (
                <div className="match-upload__file-meta">
                  <div>
                    <span>파일 형식</span>
                    <strong>{selectedFile.type || 'image'}</strong>
                  </div>
                  <div>
                    <span>파일 크기</span>
                    <strong>{formatFileSize(selectedFile.size)}</strong>
                  </div>
                </div>
              )}

              {isSubmitting && (
                <div className="match-upload__progress">
                  <span className="match-upload__progress-dot" />
                  <div>
                    <strong>업로드 처리 중</strong>
                    <p>등록이 끝나면 내 전적 확인으로 이동합니다.</p>
                  </div>
                </div>
              )}

              {errorMessage && <p className="match-upload__error">{errorMessage}</p>}

              <button type="submit" className="match-upload__submit" disabled={isSubmitting || !selectedFile}>
                {isSubmitting ? '등록 중...' : '내전 기록 등록'}
              </button>
            </form>
          </div>

          <aside className="match-upload__sidecard">
            <h3>업로드 체크</h3>
            <ul>
              <li>지원 형식: PNG, JPG, WEBP</li>
              <li>최대 용량: 100MB</li>
              <li>분석 완료 후 검수 페이지에서 수정을 저장할 수 있습니다.</li>
            </ul>
          </aside>
        </div>
      </section>
    </div>
  );
};

export default MatchUploadPage;
