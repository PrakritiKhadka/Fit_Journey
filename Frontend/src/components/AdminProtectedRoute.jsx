import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import useUserStore from '../store/user';

const AdminProtectedRoute = ({ children }) => {
  const { isAuthenticated, checkAuth, isLoading, user } = useUserStore();
  const location = useLocation();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  // Get admin emails from environment variable
  const adminEmails = import.meta.env.VITE_ADMIN_EMAILS?.split(',') || [];
  
  // Check if user is authenticated and is an admin
  const isAdmin = isAuthenticated && user?.email && adminEmails.includes(user.email);

  if (!isAuthenticated) {
    // Pass the current location to the login page
    return <Navigate to="/LoginPage" state={{ from: location }} replace />;
  }

  if (!isAdmin) {
    // If authenticated but not admin, redirect to dashboard
    return <Navigate to="/FitJourneyDashboard" replace />;
  }

  return children;
};

export default AdminProtectedRoute; 