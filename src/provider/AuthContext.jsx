/* eslint-disable react-refresh/only-export-components */
import { useCallback, useEffect, useState, createContext, useContext } from 'react';
import { authAPI } from '../api/authAPI';
import { authStorage } from '../utils/authStorage';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const clearAuthState = useCallback(() => {
    setUser(null);
    setIsAuthenticated(false);
    authStorage.clear();
  }, []);

  useEffect(() => {
    let cancelled = false;

    const restoreSession = async () => {
      const token = authStorage.getAccessToken();

      if (!token) {
        if (!cancelled) {
          setIsLoading(false);
        }
        return;
      }

      const storedUser = authStorage.getUser();
      if (storedUser && !cancelled) {
        setUser(storedUser);
        setIsAuthenticated(true);
      }

      try {
        const response = await authAPI.getMyProfile();
        if (cancelled) {
          return;
        }

        setUser(response.data);
        setIsAuthenticated(true);
        authStorage.setUser(response.data);
      } catch (error) {
        if (!cancelled) {
          const status = error?.response?.status;
          console.error('Failed to restore user session:', error);

          if (status === 401 || status === 403) {
            clearAuthState();
          }
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
  }, [clearAuthState]);

  const login = (userData, tokens) => {
    setUser(userData);
    setIsAuthenticated(true);
    authStorage.setUser(userData);
    authStorage.saveTokens(tokens);
  };

  const updateUser = useCallback((userData) => {
    setUser((currentUser) => {
      const nextUser = typeof userData === 'function' ? userData(currentUser) : { ...currentUser, ...userData };
      authStorage.setUser(nextUser);
      return nextUser;
    });
  }, []);

  const logout = async () => {
    const refreshToken = authStorage.getRefreshToken();

    try {
      if (refreshToken) {
        await authAPI.logout(refreshToken);
      }
    } catch (error) {
      console.error('Failed to logout from server session:', error);
    } finally {
      clearAuthState();
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
        updateUser,
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
