import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../provider/AuthContext';

const RequireAdmin = ({ children }) => {
  const location = useLocation();
  const { isAuthenticated, isLoading, isAdmin } = useAuth();

  if (isLoading) {
    return null;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  if (!isAdmin()) {
    return <Navigate to="/mypage" replace />;
  }

  return children;
};

export default RequireAdmin;
