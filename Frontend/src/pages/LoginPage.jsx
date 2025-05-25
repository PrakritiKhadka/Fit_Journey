import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import useUserStore from "../store/user";
import "../styles/LoginPage.css";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  const { login, googleAuth, isLoading, isAuthenticated, error, clearError } =
    useUserStore();
  const navigate = useNavigate();
  const location = useLocation();

  // Get the redirect path from location state or default to dashboard
  const from = location.state?.from?.pathname || "/FitJourneyDashboard";

  useEffect(() => {
    if (isAuthenticated) {
      navigate(from);
    }
  }, [isAuthenticated, navigate, from]);

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
      setLoginError("Please enter both email and password");
      return;
    }

    try {
      var response = await login(email, password);
      if (response.token) {
        navigate(from);
      }

    } catch (error) {
      console.error("Login error caught in component:", error);
      setLoginError(
        error.message || "Login failed. Please check your credentials."
      );
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      var credential = credentialResponse.credential;
      console.log("Google login response:", credential);
      var response = await googleAuth(credential);
      console.log("googleAuth response", response);
      navigate(from);
    } catch (error) {
      console.error("Google login component error:", error);
      setLoginError("Google login failed. Please try again.");
    }
  };

  const handleGoogleError = () => {
    console.log("Google not logging in");
    setLoginError("Google login failed. Please try again.");
  };

  return (
    <div className="login-page-container">
      <div className="login-card">
        <div className="login-header-section">
          <h1>Welcome Back</h1>
          <p>Enter your credentials to access your account</p>
        </div>

        {loginError && <div className="error-message">{loginError}</div>}

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
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

          <div className="password-reset">
            <a href="/forgot-password">Forgot password?</a>
          </div>

          <button
            type="submit"
            className="login-submit-btn"
            disabled={isLoading}
          >
            {isLoading ? "Logging in..." : "Log In"}
          </button>
        </form>

        <div className="divider-line">
          <span>OR</span>
        </div>

        <div className="google-login-container">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={handleGoogleError}
            clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}
            text="continue_with"
            shape="rectangular"
            theme="filled_blue"
          />
        </div>

        <div className="signup-redirect">
          Don't have an account? <a href="/SignupPage">Sign up</a>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;