import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json;charset=UTF-8',
    Accept: 'application/json;charset=UTF-8',
  },
});

const PUBLIC_ENDPOINTS = [
  '/auth/login',
  '/auth/signup',
  '/auth/logout',
  '/auth/mail',
  '/auth/mail/verify',
  '/auth/refresh',
  '/auth/google-login',
];

let refreshPromise = null;

const getAccessToken = () => sessionStorage.getItem('accessToken');
const getRefreshToken = () => sessionStorage.getItem('refreshToken');

const saveTokens = ({ accessToken, refreshToken }) => {
  if (accessToken) {
    sessionStorage.setItem('accessToken', accessToken);
  }

  if (refreshToken) {
    sessionStorage.setItem('refreshToken', refreshToken);
  }
};

const clearAuthStorage = () => {
  sessionStorage.removeItem('accessToken');
  sessionStorage.removeItem('refreshToken');
  sessionStorage.removeItem('user');
};

const redirectToLogin = () => {
  if (window.location.pathname !== '/login') {
    window.location.href = '/login';
  }
};

const requestTokenRefresh = async () => {
  const refreshToken = getRefreshToken();

  if (!refreshToken) {
    throw new Error('NO_REFRESH_TOKEN');
  }

  const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
    refreshToken,
  });

  saveTokens(response.data);
  return response.data.accessToken;
};

const refreshAccessToken = async () => {
  if (!refreshPromise) {
    refreshPromise = requestTokenRefresh().finally(() => {
      refreshPromise = null;
    });
  }

  return refreshPromise;
};

api.interceptors.request.use(
  (config) => {
    const isPublic = PUBLIC_ENDPOINTS.some((endpoint) => config.url?.includes(endpoint));

    if (!isPublic) {
      const token = getAccessToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const status = error.response?.status;
    const message = error.response?.data?.message;
    const isRefreshRequest = originalRequest?.url?.includes('/auth/refresh');

    if (!originalRequest) {
      return Promise.reject(error);
    }

    if (isRefreshRequest) {
      clearAuthStorage();
      redirectToLogin();
      return Promise.reject(error);
    }

    const shouldRefresh =
      (status === 401 || status === 403) &&
      !originalRequest._retry &&
      (message === 'ACCESS_TOKEN_EXPIRED' || Boolean(getRefreshToken()));

    if (!shouldRefresh) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      const accessToken = await refreshAccessToken();
      originalRequest.headers = originalRequest.headers ?? {};
      originalRequest.headers.Authorization = `Bearer ${accessToken}`;
      return api(originalRequest);
    } catch (refreshError) {
      clearAuthStorage();
      redirectToLogin();
      return Promise.reject(refreshError);
    }
  }
);

export default api;
