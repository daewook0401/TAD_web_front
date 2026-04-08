import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../provider/AuthContext';
import { authAPI } from '../api/authAPI';
import '../styles/pages/MyPage.css';

const MyPage = () => {
  const { user, isAuthenticated, isAdmin, login } = useAuth();
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ nickname: '' });
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    fetchProfile();
  }, [isAuthenticated, navigate]);

  const fetchProfile = async () => {
    try {
      const response = await authAPI.getMyProfile();
      setProfile(response.data);
      setEditForm({ nickname: response.data.nickname });
    } catch {
      setError('프로필 정보를 불러오는데 실패했습니다');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!editForm.nickname || editForm.nickname.length < 2 || editForm.nickname.length > 20) {
      setError('닉네임은 2자 이상 20자 이하로 입력해주세요');
      return;
    }

    try {
      const response = await authAPI.updateMyProfile({ nickname: editForm.nickname });
      setProfile(response.data);
      setIsEditing(false);
      setSuccess('프로필이 수정되었습니다');
      // AuthContext의 user 정보도 업데이트
      login({ ...user, nickname: response.data.nickname }, {});
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || '프로필 수정에 실패했습니다');
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
      setError('모든 비밀번호 필드를 입력해주세요');
      return;
    }

    if (passwordForm.newPassword.length < 8) {
      setError('새 비밀번호는 최소 8자 이상이어야 합니다');
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setError('새 비밀번호가 일치하지 않습니다');
      return;
    }

    try {
      await authAPI.changePassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });
      setShowPasswordForm(false);
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setSuccess('비밀번호가 변경되었습니다');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || '비밀번호 변경에 실패했습니다');
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (isLoading) {
    return (
      <div className="mypage">
        <div className="mypage__loading">로딩 중...</div>
      </div>
    );
  }

  return (
    <div className="mypage">
      <div className="mypage__container">
        <h1 className="mypage__title">마이페이지</h1>

        {error && (
          <div className="mypage__message mypage__message--error">
            <p>{error}</p>
          </div>
        )}
        {success && (
          <div className="mypage__message mypage__message--success">
            <p>{success}</p>
          </div>
        )}

        {/* 프로필 카드 */}
        <div className="mypage__card">
          <div className="mypage__card-header">
            <h2 className="mypage__card-title">프로필 정보</h2>
            {!isEditing && (
              <button
                className="mypage__edit-btn"
                onClick={() => setIsEditing(true)}
              >
                수정
              </button>
            )}
          </div>

          <div className="mypage__profile">
            <div className="mypage__avatar">
              {(profile?.nickname || user?.nickname || 'U').charAt(0)}
            </div>
            <div className="mypage__info">
              {isEditing ? (
                <form onSubmit={handleEditSubmit} className="mypage__edit-form">
                  <div className="mypage__form-group">
                    <label className="mypage__label">닉네임</label>
                    <input
                      type="text"
                      value={editForm.nickname}
                      onChange={(e) => setEditForm({ nickname: e.target.value })}
                      className="mypage__input"
                      maxLength={20}
                    />
                  </div>
                  <div className="mypage__edit-actions">
                    <button type="submit" className="mypage__save-btn">저장</button>
                    <button
                      type="button"
                      className="mypage__cancel-btn"
                      onClick={() => {
                        setIsEditing(false);
                        setEditForm({ nickname: profile?.nickname });
                        setError('');
                      }}
                    >
                      취소
                    </button>
                  </div>
                </form>
              ) : (
                <>
                  <div className="mypage__info-row">
                    <span className="mypage__info-label">닉네임</span>
                    <span className="mypage__info-value">
                      {profile?.nickname || user?.nickname}
                      {isAdmin() && <span className="mypage__admin-badge">관리자</span>}
                    </span>
                  </div>
                  <div className="mypage__info-row">
                    <span className="mypage__info-label">이메일</span>
                    <span className="mypage__info-value">{profile?.email || user?.email}</span>
                  </div>
                  <div className="mypage__info-row">
                    <span className="mypage__info-label">이메일 인증</span>
                    <span className="mypage__info-value">
                      {profile?.emailVerified ? (
                        <span className="mypage__verified">✓ 인증됨</span>
                      ) : (
                        <span className="mypage__unverified">미인증</span>
                      )}
                    </span>
                  </div>
                  <div className="mypage__info-row">
                    <span className="mypage__info-label">가입일</span>
                    <span className="mypage__info-value">{formatDate(profile?.createdAt)}</span>
                  </div>
                  <div className="mypage__info-row">
                    <span className="mypage__info-label">마지막 로그인</span>
                    <span className="mypage__info-value">{formatDate(profile?.lastLoginAt)}</span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* 비밀번호 변경 */}
        <div className="mypage__card">
          <div className="mypage__card-header">
            <h2 className="mypage__card-title">보안</h2>
          </div>

          {showPasswordForm ? (
            <form onSubmit={handlePasswordSubmit} className="mypage__password-form">
              <div className="mypage__form-group">
                <label className="mypage__label">현재 비밀번호</label>
                <input
                  type="password"
                  value={passwordForm.currentPassword}
                  onChange={(e) => setPasswordForm((prev) => ({ ...prev, currentPassword: e.target.value }))}
                  className="mypage__input"
                />
              </div>
              <div className="mypage__form-group">
                <label className="mypage__label">새 비밀번호</label>
                <input
                  type="password"
                  value={passwordForm.newPassword}
                  onChange={(e) => setPasswordForm((prev) => ({ ...prev, newPassword: e.target.value }))}
                  className="mypage__input"
                  placeholder="8자 이상"
                />
              </div>
              <div className="mypage__form-group">
                <label className="mypage__label">새 비밀번호 확인</label>
                <input
                  type="password"
                  value={passwordForm.confirmPassword}
                  onChange={(e) => setPasswordForm((prev) => ({ ...prev, confirmPassword: e.target.value }))}
                  className="mypage__input"
                />
              </div>
              <div className="mypage__edit-actions">
                <button type="submit" className="mypage__save-btn">변경</button>
                <button
                  type="button"
                  className="mypage__cancel-btn"
                  onClick={() => {
                    setShowPasswordForm(false);
                    setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
                    setError('');
                  }}
                >
                  취소
                </button>
              </div>
            </form>
          ) : (
            <button
              className="mypage__password-btn"
              onClick={() => setShowPasswordForm(true)}
            >
              비밀번호 변경
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyPage;
