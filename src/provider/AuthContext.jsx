/* eslint-disable react-refresh/only-export-components */
import { useEffect, useState, createContext, useContext } from 'react';
import { authAPI } from '../api/authAPI';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const clearAuthStorage = () => {
    setUser(null);
    setIsAuthenticated(false);
    sessionStorage.removeItem('accessToken');
    sessionStorage.removeItem('refreshToken');
    sessionStorage.removeItem('user');
  };

  useEffect(() => {
    let cancelled = false;

    const restoreSession = async () => {
      const token = sessionStorage.getItem('accessToken');
      const rawUser = sessionStorage.getItem('user');

      if (!token) {
        if (!cancelled) {
          setIsLoading(false);
        }
        return;
      }

      try {
        if (rawUser && !cancelled) {
          setUser(JSON.parse(rawUser));
          setIsAuthenticated(true);
        }

        const response = await authAPI.getMyProfile();
        if (cancelled) {
          return;
        }

        setUser(response.data);
        setIsAuthenticated(true);
        sessionStorage.setItem('user', JSON.stringify(response.data));
      } catch (error) {
        if (!cancelled) {
          console.error('Failed to restore user session:', error);
          clearAuthStorage();
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    restoreSession();

    return () => {
      cancelled = true;
    };
  }, []);

  const login = (userData, tokens) => {
    setUser(userData);
    setIsAuthenticated(true);
    sessionStorage.setItem('user', JSON.stringify(userData));
    if (tokens?.accessToken) {
      sessionStorage.setItem('accessToken', tokens.accessToken);
    }
    if (tokens?.refreshToken) {
      sessionStorage.setItem('refreshToken', tokens.refreshToken);
    }
  };

  const logout = async () => {
    const refreshToken = sessionStorage.getItem('refreshToken');

    try {
      if (refreshToken) {
        await authAPI.logout(refreshToken);
      }
    } catch (error) {
      console.error('Failed to logout from server session:', error);
    } finally {
      clearAuthStorage();
    }
  };

  const isAdmin = () => user?.roles?.includes('ROLE_ADMIN') || false;

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        login,
        logout,
        isAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
