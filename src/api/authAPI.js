import api from './baseAPI';

export const authAPI = {
  // 회원가입
  signup: (data) => api.post('/auth/signup', data),
  
  // 로그인
  login: (data) => api.post('/auth/login', data),
  
  // 로그아웃
  logout: () => api.post('/auth/logout'),
  
  // 이메일 인증 코드 발송
  sendVerificationCode: (email) => api.post('/auth/mail', { email }),
  
  // 이메일 인증 코드 확인
  verifyEmailCode: (email, code) => api.post('/auth/mail/verify', { email, code }),
  
  // 토큰 갱신
  refreshToken: (refreshToken) => api.post('/auth/refresh', { refreshToken }),

  // 내 프로필 조회
  getMyProfile: () => api.get('/auth/me'),

  // 프로필 수정
  updateMyProfile: (data) => api.put('/auth/me', data),

  // 비밀번호 변경
  changePassword: (data) => api.put('/auth/me/password', data),
};

export default authAPI;
