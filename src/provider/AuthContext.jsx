import { useState, useEffect, createContext, useContext } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // 초기 로드 시 세션스토리지에서 토큰 확인
  useEffect(() => {
    const token = sessionStorage.getItem('token_UUID');
    const userData = sessionStorage.getItem('user');
    
    if (token && userData) {
      try {
        setUser(JSON.parse(userData));
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Failed to parse user data:', error);
        sessionStorage.removeItem('token_UUID');
        sessionStorage.removeItem('user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = (token_UUID, userData = {}) => {
    setUser({
      ...userData,
      token: token_UUID
    });
    setIsAuthenticated(true);
    sessionStorage.setItem('token_UUID', token_UUID);
    sessionStorage.setItem('user', JSON.stringify({
      ...userData,
      token: token_UUID
    }));
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    sessionStorage.removeItem('token_UUID');
    sessionStorage.removeItem('user');
  };

  const value = {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// useAuth 훅
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};