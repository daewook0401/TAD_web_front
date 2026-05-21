import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';
const AUTH_API_BASE_URL =
  import.meta.env.VITE_AUTH_API_BASE_URL || import.meta.env.VITE_GATEWAY_API_BASE_URL || API_BASE_URL;

const createApiClient = (baseURL, options = {}) => axios.create({
  baseURL,
  timeout: 10000,
  withCredentials: options.withCredentials ?? false,
  headers: {
    'Content-Type': 'application/json;charset=UTF-8',
    Accept: 'application/json;charset=UTF-8',
  },
});

const api = createApiClient(API_BASE_URL);
export const authApi = createApiClient(AUTH_API_BASE_URL, { withCredentials: true });

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

const saveTokens = ({ accessToken } = {}) => {
  if (accessToken) {
    sessionStorage.setItem('accessToken', accessToken);
  }
};

const clearAuthStorage = () => {
  sessionStorage.removeItem('accessToken');
  sessionStorage.removeItem('user');
};

const redirectToLogin = () => {
  if (window.location.pathname !== '/login') {
    window.location.href = '/login';
  }
};

const requestTokenRefresh = async () => {
  const response = await axios.post(`${AUTH_API_BASE_URL}/auth/refresh`, null, {
    withCredentials: true,
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

const installAuthInterceptors = (client) => {
  client.interceptors.request.use(
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

  client.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;
      const status = error.response?.status;
      const message = error.response?.data?.message;
      const isRefreshRequest = originalRequest?.url?.includes('/auth/refresh');
      const isPublicRequest = PUBLIC_ENDPOINTS.some((endpoint) => originalRequest?.url?.includes(endpoint));

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
        !isPublicRequest &&
        (message === 'ACCESS_TOKEN_EXPIRED' || message === 'INVALID_TOKEN' || status === 401 || status === 403);

      if (!shouldRefresh) {
        return Promise.reject(error);
      }

      originalRequest._retry = true;

      try {
        const accessToken = await refreshAccessToken();
        originalRequest.headers = originalRequest.headers ?? {};
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return client(originalRequest);
      } catch (refreshError) {
        clearAuthStorage();
        redirectToLogin();
        return Promise.reject(refreshError);
      }
    }
  );
};

installAuthInterceptors(api);
installAuthInterceptors(authApi);

export default api;
