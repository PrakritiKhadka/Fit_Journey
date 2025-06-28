import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import useUserStore from "../store/user";
import "../styles/LoginPage.css";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  const {
    login,
    googleAuth,
    isLoading,
    isAuthenticated,
    error,
    clearError,
    user,
  } = useUserStore();
  const navigate = useNavigate();
  const location = useLocation();

  const navigateByRole = (userRole) => {
    if (userRole === "admin") {
      navigate("/AdminPanel");
    } else {
      navigate("/FitJourneyDashboard");
    }
  };

  useEffect(() => {
    if (isAuthenticated && user) {
      navigateByRole(user.role);
    }
  }, [isAuthenticated, user, navigate]);

  useEffect(() => {
    if (error) {
      setLoginError(error);
    }
    return () => {
      clearError();
    };
  }, [error, clearError]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoginError("");

    if (!email || !password) {
      setLoginError("Please enter email and password");
      return;
    }

    try {
      const response = await login(email, password);
      console.log("Login successful:", response);
    } catch (error) {
      console.error("Login error caught in component:", error);
      setLoginError(
        error.message || "Login failed. Please check your credentials."
      );
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      setLoginError("");
      const credential = credentialResponse.credential;
      const response = await googleAuth(credential);
      console.log("Google login successful:", response);
    } catch (error) {
      console.error("Google login component error:", error);
      setLoginError(error.message || "Google login failed. Please try again.");
    }
  };

  const handleGoogleError = () => {
    console.log("Google not logging in");
    setLoginError("Google login failed. Please try again.");
  };

  return (
    <div className="login-container">
      <div className="login-grid">
        <div className="login-brand-section">
          <div className="brand-content">
            <div className="logo-placeholder">
              <div className="logo-icon">🏃‍♂️</div>
            </div>
            <h1 className="brand-title">FitTracker</h1>
            <p className="brand-subtitle">Track your fitness journey</p>
            <div className="features-list">
              <div className="feature-item">
                <span className="feature-icon">📊</span>
                <span>Track workouts & progress</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">🎯</span>
                <span>Set and achieve goals</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">📈</span>
                <span>Analyze performance</span>
              </div>
            </div>
          </div>
        </div>

        <div className="login-form-section">
          <div className="form-container">
            <div className="form-header">
              <h2>Welcome Back</h2>
              <p>Continue your fitness journey</p>
            </div>

            {loginError && (
              <div className="error-alert">
                <span className="error-icon">⚠️</span>
                {loginError}
              </div>
            )}

            <form onSubmit={handleSubmit} className="login-form">
              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input
                  type="email"
                  id="email"
                  placeholder="your.email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <div className="form-options">
                <a href="/forgot-password" className="forgot-link">
                  Forgot password?
                </a>
              </div>

              <button
                type="submit"
                className="submit-button"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="loading-text">
                    <span className="spinner"></span>
                    Signing in...
                  </span>
                ) : (
                  "Sign In"
                )}
              </button>
            </form>

            <div className="divider">
              <span>or continue with</span>
            </div>

            <div className="google-login-wrapper">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={handleGoogleError}
                clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}
                text="continue_with"
                shape="rectangular"
                theme="filled_blue"
                width="100%"
              />
            </div>

            <div className="signup-prompt">
              <span>New to FitTracker?</span>
              <a href="/SignupPage" className="signup-link">
                Create account
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
