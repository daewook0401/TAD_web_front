import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../provider/AuthContext';
import { authAPI } from '../../api/authAPI';
import GoogleAuthButton from '../../components/auth/GoogleAuthButton';
import { googleSignupDraft } from '../../utils/googleSignupDraft';
import '../../styles/pages/AuthPages.css';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const completeLogin = (data) => {
    login(
      {
        id: data.user.id,
        nickname: data.user.nickname,
        email: data.user.email,
        roles: data.user.roles,
      },
      {
        accessToken: data.accessToken,
      }
    );
    navigate('/matches/my');
  };

  const redirectToGoogleSignup = (data) => {
    const draft = {
      registrationToken: data.registrationToken,
      email: data.email,
      nickname: data.nickname,
      profileImageUrl: data.profileImageUrl,
    };

    googleSignupDraft.save(draft);
    navigate('/signup/google', { state: draft });
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setError('');

    if (!formData.email || !formData.password) {
      setError('이메일과 비밀번호를 입력해주세요.');
      setIsLoading(false);
      return;
    }

    try {
      const response = await authAPI.login({
        email: formData.email,
        password: formData.password,
      });

      if (response.data.success) {
        completeLogin(response.data);
      } else {
        setError(response.data.message || '로그인에 실패했습니다.');
      }
    } catch (err) {
      setError(err.response?.data?.message || '로그인 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleCredential = async (credential) => {
    setIsLoading(true);
    setError('');

    try {
      const response = await authAPI.googleLogin(credential);
      if (response.data.registrationRequired) {
        redirectToGoogleSignup(response.data);
        return;
      }

      if (response.data.success) {
        completeLogin(response.data);
        return;
      }
      setError(response.data.message || 'Google 로그인에 실패했습니다.');
    } catch (err) {
      setError(err.response?.data?.message || 'Google 로그인 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-logo">
          <h2 className="auth-logo__title">TAD</h2>
          <p className="auth-logo__subtitle">게임 전적 관리 플랫폼</p>
        </div>

        <div className="auth-card">
          <div className="auth-card__header">
            <h1 className="auth-card__title">로그인</h1>
            <p className="auth-card__subtitle">TAD에 로그인해보세요</p>
          </div>

          {error && (
            <div className="auth-message auth-message--error">
              <p>{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="auth-input-group">
              <label htmlFor="email" className="auth-label">이메일</label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                value={formData.email}
                onChange={handleChange}
                className="auth-input"
                placeholder="example@email.com"
              />
            </div>

            <div className="auth-input-group">
              <label htmlFor="password" className="auth-label">비밀번호</label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                value={formData.password}
                onChange={handleChange}
                className="auth-input"
                placeholder="비밀번호를 입력해주세요"
              />
            </div>

            <div className="auth-options-row">
              <label className="auth-remember">
                <input type="checkbox" className="auth-remember-checkbox" defaultChecked />
                <span className="auth-remember-label">로그인 상태 유지</span>
              </label>
              <Link to="#" className="auth-forgot-link">비밀번호 찾기</Link>
            </div>

            <button type="submit" disabled={isLoading} className="auth-submit-btn">
              {isLoading ? '로그인 중...' : '로그인'}
            </button>
          </form>

          <div className="auth-divider">
            <div className="auth-divider__line"></div>
            <span className="auth-divider__text">또는</span>
            <div className="auth-divider__line"></div>
          </div>

          <div className="auth-social">
            <GoogleAuthButton
              text="signin_with"
              onCredential={handleGoogleCredential}
              onError={() => setError('Google 로그인에 실패했습니다.')}
            />
          </div>

          <div className="auth-link-section">
            <p className="auth-link-text">
              아직 계정이 없으신가요?{' '}
              <Link to="/signup" className="auth-link">회원가입</Link>
            </p>
          </div>
        </div>

        <div className="auth-footer">
          <p><Link to="/">홈으로 돌아가기</Link></p>
          <p>
            <Link to="#">이용약관</Link>
            {' | '}
            <Link to="#">개인정보처리방침</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
