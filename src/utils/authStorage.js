const ACCESS_TOKEN_KEY = 'accessToken';
const REFRESH_TOKEN_KEY = 'refreshToken';
const USER_KEY = 'user';

export const authStorage = {
  getAccessToken: () => sessionStorage.getItem(ACCESS_TOKEN_KEY),

  getRefreshToken: () => sessionStorage.getItem(REFRESH_TOKEN_KEY),

  hasAccessToken: () => Boolean(sessionStorage.getItem(ACCESS_TOKEN_KEY)),

  getUser: () => {
    const rawUser = sessionStorage.getItem(USER_KEY);
    if (!rawUser) {
      return null;
    }

    try {
      return JSON.parse(rawUser);
    } catch {
      sessionStorage.removeItem(USER_KEY);
      return null;
    }
  },

  setUser: (user) => {
    if (!user) {
      sessionStorage.removeItem(USER_KEY);
      return;
    }

    sessionStorage.setItem(USER_KEY, JSON.stringify(user));
  },

  saveTokens: ({ accessToken, refreshToken } = {}) => {
    if (accessToken) {
      sessionStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
    }

    if (refreshToken) {
      sessionStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
    }
  },

  clear: () => {
    sessionStorage.removeItem(ACCESS_TOKEN_KEY);
    sessionStorage.removeItem(REFRESH_TOKEN_KEY);
    sessionStorage.removeItem(USER_KEY);
  },
};
