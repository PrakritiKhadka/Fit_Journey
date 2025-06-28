import React, { useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import useUserStore from "../store/user";

const AdminProtectedRoute = ({ children }) => {
  const { isAuthenticated, checkAuth, isLoading, user } = useUserStore();
  const location = useLocation();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    // Pass the current location to the login page
    return <Navigate to="/LoginPage" state={{ from: location }} replace />;
  }

  // Check if user is an admin based on role field
  const isAdmin = user?.role === "admin";

  if (!isAdmin) {
    // If authenticated but not admin, redirect to user dashboard
    return <Navigate to="/FitJourneyDashboard" replace />;
  }

  return children;
};

export default AdminProtectedRoute;
