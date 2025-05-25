import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import useUserStore from '../store/user';

const PrivateRoute = ({ children }) => {
  const { isAuthenticated, token, checkAuth, isLoading } = useUserStore();
  const [checking, setChecking] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const verifyAuth = async () => {
      if (token && !isAuthenticated) {
        await checkAuth();
      }
      setChecking(false);
    };

    verifyAuth();
  }, [token, isAuthenticated, checkAuth]);

  if (checking || isLoading) {
    // You could return a loading spinner here
    return <div>Loading...</div>;
  }

  return isAuthenticated ? (
    children
  ) : (
    <Navigate to="/LoginPage" state={{ from: location }} replace />
  );
};

export default PrivateRoute;