import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import useUserStore from "../store/user";
import "../styles/navbar.css";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAuthenticated, logout, user, error, clearError, checkAuth } =
    useUserStore();
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuthStatus = async () => {
      await checkAuth();
    };
    checkAuthStatus();
  }, [checkAuth, navigate]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        clearError();
      }, 5001);

      return () => clearTimeout(timer);
    }
  }, [error, clearError]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <>
      {error && (
        <div className="error-banner">
          {error}
          <button onClick={clearError} className="close-error">
            ×
          </button>
        </div>
      )}

      <nav className="navbar">
        <div className="navbar-brand">
          <Link to="/">FitJourney</Link>
          <button className="menu-toggle" onClick={toggleMenu}>
            <span className={`hamburger ${isMenuOpen ? 'open' : ''}`}></span>
          </button>
        </div>
        
        <div className={`navbar-menu ${isMenuOpen ? 'active' : ''}`}>
          <Link to="/" onClick={() => setIsMenuOpen(false)}>Home</Link>
          <Link to="/blog" onClick={() => setIsMenuOpen(false)}>Blog</Link>
          {isAuthenticated && (
            <>
              <Link to="/FitJourneyDashboard" onClick={() => setIsMenuOpen(false)}>Dashboard</Link>
            </>
          )}
        </div>

        <div className={isMenuOpen ? "auth-buttons active" : "auth-buttons"}>
          {isAuthenticated ? (
            <>
              <span className="user-greeting">
                Hello, {user?.name || "User"}
              </span>
              <button onClick={handleLogout} className="logout-button">
                Log Out
              </button>
            </>
          ) : (
            <>
              <Link to="/LoginPage" className="login-button">
                Log In
              </Link>
              <Link to="/SignupPage" className="signup-button">
                Sign Up
              </Link>
            </>
          )}
        </div>
      </nav>
    </>
  );
};

export default Navbar;
