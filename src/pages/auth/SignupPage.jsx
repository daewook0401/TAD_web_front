import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../provider/AuthContext';
import { authAPI } from '../../api/authAPI';
import '../../styles/pages/AuthPages.css';

const SignupPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false,
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      setError('모든 필드를 입력해주세요');
      setIsLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('비밀번호가 일치하지 않습니다');
      setIsLoading(false);
      return;
    }

    if (formData.password.length < 8) {
      setError('비밀번호는 최소 8자 이상이어야 합니다');
      setIsLoading(false);
      return;
    }

    if (!formData.agreeTerms) {
      setError('이용약관에 동의해주세요');
      setIsLoading(false);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('유효한 이메일을 입력해주세요');
      setIsLoading(false);
      return;
    }

    try {
      const response = await authAPI.signup({
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });

      if (response.data.success) {
        const loginResponse = await authAPI.login({
          email: formData.email,
          password: formData.password,
        });

        if (loginResponse.data.success) {
          login({
            id: loginResponse.data.user.id,
            name: loginResponse.data.user.name,
            email: loginResponse.data.user.email,
          });
          localStorage.setItem('token', loginResponse.data.token);
          setSuccess('회원가입이 완료되었습니다!');
          setTimeout(() => {
            navigate('/');
          }, 1500);
        }
      } else {
        setError(response.data.message || '회원가입에 실패했습니다');
      }
    } catch (err) {
      setError(err.response?.data?.message || '회원가입 중 오류가 발생했습니다');
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
            <h1 className="auth-card__title">회원가입</h1>
            <p className="auth-card__subtitle">새로운 계정을 만들어보세요</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="auth-message auth-message--error">
              <p>{error}</p>
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="auth-message auth-message--success">
              <p>{success}</p>
            </div>
          )}

          {/* Signup Form */}
          <form onSubmit={handleSubmit} className="auth-form">
            {/* Name Input */}
            <div className="auth-input-group">
              <label htmlFor="name" className="auth-label">이름</label>
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                value={formData.name}
                onChange={handleChange}
                className="auth-input"
                placeholder="홍길동"
              />
            </div>

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
                autoComplete="new-password"
                value={formData.password}
                onChange={handleChange}
                className="auth-input"
                placeholder="8자 이상 입력하세요"
              />
            </div>

            {/* Confirm Password Input */}
            <div className="auth-input-group">
              <label htmlFor="confirmPassword" className="auth-label">비밀번호 확인</label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="auth-input"
                placeholder="비밀번호를 다시 입력하세요"
              />
            </div>

            {/* Terms Agreement */}
            <div className="auth-checkbox-group">
              <input
                id="agreeTerms"
                name="agreeTerms"
                type="checkbox"
                checked={formData.agreeTerms}
                onChange={handleChange}
                className="auth-checkbox"
              />
              <label htmlFor="agreeTerms" className="auth-checkbox-label">
                이용약관 및 개인정보처리방침에 동의합니다
              </label>
            </div>

            {/* Submit Button */}
            <button type="submit" disabled={isLoading} className="auth-submit-btn">
              {isLoading ? '처리 중...' : '회원가입'}
            </button>
          </form>

          {/* Divider */}
          <div className="auth-divider">
            <div className="auth-divider__line"></div>
            <span className="auth-divider__text">또는</span>
            <div className="auth-divider__line"></div>
          </div>

          {/* Social Signup - Google */}
          <div className="auth-social">
            <button type="button" className="google-btn">
              <svg className="google-btn__icon" viewBox="0 0 48 48">
                <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
              </svg>
              <span className="google-btn__text">Google로 가입</span>
            </button>
          </div>

          {/* Login Link */}
          <div className="auth-link-section">
            <p className="auth-link-text">
              이미 계정이 있으신가요?{' '}
              <Link to="/login" className="auth-link">로그인</Link>
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

export default SignupPage;
