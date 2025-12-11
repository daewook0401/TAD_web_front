import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../provider/AuthContext';
import { authAPI } from '../../api/authAPI';

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

    // 유효성 검사
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

    // 이메일 형식 검사
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
        // 회원가입 후 자동 로그인
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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        {/* Logo */}
        <div className="text-center">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            TAD
          </h2>
          <p className="mt-2 text-gray-300">게임 전적 관리 플랫폼</p>
        </div>

        {/* Card */}
        <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl shadow-xl border border-gray-700 p-8 space-y-6">
          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-white">회원가입</h1>
            <p className="text-gray-300">TAD에 새로운 계정을 만드세요</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4">
              <p className="text-sm text-red-400">{error}</p>
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="bg-green-500/20 border border-green-500/50 rounded-lg p-4">
              <p className="text-sm text-green-400">{success}</p>
            </div>
          )}

          {/* Signup Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name Input */}
            <div>
              <label htmlFor="name" className="block text-sm font-semibold text-gray-200 mb-2">
                사용자명
              </label>
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-white placeholder-gray-500"
                placeholder="사용자명을 입력하세요"
              />
            </div>

            {/* Email Input */}
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-200 mb-2">
                이메일
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-white placeholder-gray-500"
                placeholder="example@email.com"
              />
            </div>

            {/* Password Input */}
            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-gray-200 mb-2">
                비밀번호
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-white placeholder-gray-500"
                placeholder="최소 8자 이상"
              />
              <p className="text-xs text-gray-400 mt-1">최소 8자 이상의 비밀번호를 입력하세요</p>
            </div>

            {/* Confirm Password Input */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-200 mb-2">
                비밀번호 확인
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-white placeholder-gray-500"
                placeholder="비밀번호를 다시 입력하세요"
              />
            </div>

            {/* Terms Agreement */}
            <div className="space-y-3 py-2">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="agreeTerms"
                  checked={formData.agreeTerms}
                  onChange={handleChange}
                  className="w-5 h-5 rounded border-gray-600 accent-blue-500 mt-0.5 flex-shrink-0"
                />
                <span className="text-sm text-gray-300">
                  <Link to="#" className="text-blue-400 hover:text-blue-300 font-medium">
                    이용약관
                  </Link>
                  과{' '}
                  <Link to="#" className="text-blue-400 hover:text-blue-300 font-medium">
                    개인정보처리방침
                  </Link>
                  에 동의합니다
                </span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed mt-6"
            >
              {isLoading ? '가입 중...' : '회원가입'}
            </button>
          </form>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-700"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-gray-800/50 text-gray-400">또는</span>
            </div>
          </div>

          {/* Social Signup */}
          <button className="w-full py-3 px-4 border border-gray-600 rounded-lg hover:bg-gray-700/50 transition-colors duration-200 flex items-center justify-center gap-2 font-medium text-gray-200">
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Google 회원가입
          </button>

          {/* Login Link */}
          <div className="text-center">
            <p className="text-gray-300">
              이미 계정이 있으신가요?{' '}
              <Link to="/login" className="text-blue-400 hover:text-blue-300 font-semibold">
                로그인
              </Link>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-sm text-gray-400">
          <Link to="/" className="text-blue-400 hover:text-blue-300">
            홈으로 돌아가기
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
