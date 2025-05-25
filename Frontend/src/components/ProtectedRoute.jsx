import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import useUserStore from '../store/user';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, checkAuth, isLoading } = useUserStore();
  const location = useLocation();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/LoginPage" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;