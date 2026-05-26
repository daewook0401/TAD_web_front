import api, { authApi } from './baseAPI';

export const authAPI = {
  // 회원가입
  signup: (data) => authApi.post('/auth/signup', data),
  
  // 로그인
  login: (data) => authApi.post('/auth/login', data),

  // Google 로그인
  googleLogin: (token) => authApi.post('/auth/google-login', { token }),

  // Google 가입 완료
  completeGoogleSignup: (data) => authApi.post('/auth/google-signup', data),
  
  // 로그아웃
  logout: () => authApi.post('/auth/logout'),
  
  // 이메일 인증 코드 발송
  sendVerificationCode: (email) => authApi.post('/auth/mail', { email }),
  
  // 이메일 인증 코드 확인
  verifyEmailCode: (email, code) => authApi.post('/auth/mail/verify', { email, code }),
  
  // 토큰 갱신
  refreshToken: () => authApi.post('/auth/refresh'),

  // 내 프로필 조회
  getMyProfile: () => authApi.get('/auth/me'),

  // 마이페이지 활동 요약 조회
  getMySummary: () => api.get('/mypage/summary'),

  // 프로필 수정
  updateMyProfile: (data) => authApi.put('/auth/me', data),

  // 비밀번호 변경
  changePassword: (data) => authApi.put('/auth/me/password', data),

  // 회원 탈퇴
  withdrawAccount: () => authApi.delete('/auth/me'),
};

export default authAPI;
