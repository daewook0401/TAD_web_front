import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../provider/AuthContext';
import { authAPI } from '../../api/authAPI';
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (!formData.email || !formData.password) {
      setError('이메일과 비밀번호를 입력해주세요');
      setIsLoading(false);
      return;
    }

    try {
      const response = await authAPI.login({
        email: formData.email,
        password: formData.password,
      });

      if (response.data.success) {
        login({
          id: response.data.user.id,
          name: response.data.user.name,
          email: response.data.user.email,
        });
        localStorage.setItem('token', response.data.token);
        navigate('/matches/my');
      } else {
        setError(response.data.message || '로그인에 실패했습니다');
      }
    } catch (err) {
      setError(err.response?.data?.message || '로그인 중 오류가 발생했습니다');
    }

    setIsLoading(false);
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        {/* Logo */}
        <div className="auth-logo">
          <h2 className="auth-logo__title">TAD</h2>
          <p className="auth-logo__subtitle">게임 전적 관리 플랫폼</p>
        </div>

        {/* Card */}
        <div className="auth-card">
          <div className="auth-card__header">
            <h1 className="auth-card__title">로그인</h1>
            <p className="auth-card__subtitle">TAD에 로그인하세요</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="auth-message auth-message--error">
              <p>{error}</p>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="auth-form">
            {/* Email Input */}
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

            {/* Password Input */}
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
                placeholder="비밀번호를 입력하세요"
              />
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="auth-options-row">
              <label className="auth-remember">
                <input type="checkbox" className="auth-remember-checkbox" defaultChecked />
                <span className="auth-remember-label">로그인 상태 유지</span>
              </label>
              <Link to="#" className="auth-forgot-link">비밀번호 찾기</Link>
            </div>

            {/* Submit Button */}
            <button type="submit" disabled={isLoading} className="auth-submit-btn">
              {isLoading ? '로그인 중...' : '로그인'}
            </button>
          </form>

          {/* Divider */}
          <div className="auth-divider">
            <div className="auth-divider__line"></div>
            <span className="auth-divider__text">또는</span>
            <div className="auth-divider__line"></div>
          </div>

          {/* Social Login - Google */}
          <div className="auth-social">
            <button type="button" className="google-btn">
              <svg className="google-btn__icon" viewBox="0 0 48 48">
                <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
              </svg>
              <span className="google-btn__text">Google 계정으로 로그인</span>
            </button>
          </div>

          {/* Sign Up Link */}
          <div className="auth-link-section">
            <p className="auth-link-text">
              아직 계정이 없으신가요?{' '}
              <Link to="/signup" className="auth-link">회원가입</Link>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="auth-footer">
          <p><Link to="/">홈으로 돌아가기</Link></p>
          <p>
            <Link to="#">이용약관</Link>
            {' • '}
            <Link to="#">개인정보처리방침</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
