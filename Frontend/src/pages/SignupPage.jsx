import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import useUserStore from "../store/user";
import "../styles/SignupPage.css";

const SignupPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    gender: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "user",
  });
  const [signupError, setSignupError] = useState("");

  const {
    register,
    googleSignUp,
    isLoading,
    isAuthenticated,
    error,
    clearError,
    user,
  } = useUserStore();
  const navigate = useNavigate();

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
      setSignupError(error);
    }
    return () => {
      clearError();
    };
  }, [error, clearError]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const validateForm = () => {
    if (
      !formData.name ||
      !formData.email ||
      !formData.password ||
      !formData.role
    ) {
      setSignupError("Name, email, password, and role are required");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setSignupError("Please enter a valid email address");
      return false;
    }

    if (formData.age && formData.age !== "") {
      const age = parseInt(formData.age, 10);
      if (isNaN(age) || age < 13) {
        setSignupError("Age must be at least 13 years old");
        return false;
      }
    }

    if (formData.password.trim().length < 8) {
      setSignupError("Password must be at least 8 characters long");
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      setSignupError("Passwords do not match");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSignupError("");

    if (!validateForm()) {
      return;
    }

    try {
      const { confirmPassword, ...userData } = formData;

      if (userData.age && userData.age !== "") {
        userData.age = parseInt(userData.age, 10);
      } else {
        delete userData.age;
      }

      if (!userData.gender) {
        userData.gender = "prefer-not-to-say";
      }

      const response = await register(userData);
      console.log("Registration successful:", response);
    } catch (error) {
      console.error("Registration error caught in component:", error);
      setSignupError(error.message || "Registration failed. Please try again.");
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      setSignupError("");
      const response = await googleSignUp(
        credentialResponse.credential,
        formData.role
      );
      console.log("Google signup successful:", response);
    } catch (error) {
      console.error("Google signup component error:", error);
      setSignupError(
        error.message || "Google signup failed. Please try again."
      );
    }
  };

  const handleGoogleError = () => {
    console.error("Google signup failed");
    setSignupError("Google signup failed. Please try again.");
  };

  return (
    <div className="signup-page">
      <div className="signup-container">
        <div className="signup-hero">
          <div className="hero-content">
            <h1>Start Your Fitness Journey</h1>
            <p>
              Join thousands of athletes tracking their progress and achieving
              their goals.
            </p>
          </div>
        </div>

        <div className="signup-form-section">
          <div className="form-header">
            <h2>Create Your Account</h2>
            <p>Choose your path to fitness success</p>
          </div>

          {signupError && <div className="error-message">{signupError}</div>}

          <div className="role-selector">
            <div className="role-options">
              <label
                className={`role-option ${
                  formData.role === "user" ? "selected" : ""
                }`}
              >
                <input
                  type="radio"
                  name="role"
                  value="user"
                  checked={formData.role === "user"}
                  onChange={handleChange}
                />
                <div className="role-content">
                  <div className="role-icon">🏃‍♂️</div>
                  <div className="role-text">
                    <span className="role-title">Athlete</span>
                    <span className="role-description">
                      Track workouts & progress
                    </span>
                  </div>
                </div>
              </label>
              <label
                className={`role-option ${
                  formData.role === "admin" ? "selected" : ""
                }`}
              >
                <input
                  type="radio"
                  name="role"
                  value="admin"
                  checked={formData.role === "admin"}
                  onChange={handleChange}
                />
                <div className="role-content">
                  <div className="role-icon">👨‍💼</div>
                  <div className="role-text">
                    <span className="role-title">Coach</span>
                    <span className="role-description">
                      Manage athletes & programs
                    </span>
                  </div>
                </div>
              </label>
            </div>
          </div>

          <div className="social-signup">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
              useOneTap={false}
              text="signup_with"
              shape="rectangular"
              theme="filled_blue"
            />
          </div>

          <div className="divider">
            <span>or sign up with email</span>
          </div>

          <form onSubmit={handleSubmit} className="signup-form">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="name">Full Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Enter your full name"
                />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="your.email@example.com"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="age">Age (Optional)</label>
                <input
                  type="number"
                  id="age"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  min="13"
                  placeholder="13+"
                />
              </div>
              <div className="form-group">
                <label htmlFor="gender">Gender</label>
                <select
                  id="gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                >
                  <option value="">Select (Optional)</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="non-binary">Non-binary</option>
                  <option value="prefer-not-to-say">Prefer not to say</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  minLength="8"
                  placeholder="Minimum 8 characters"
                />
              </div>
              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm Password</label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  minLength="8"
                  placeholder="Confirm your password"
                />
              </div>
            </div>

            <button type="submit" className="signup-btn" disabled={isLoading}>
              {isLoading ? (
                <>
                  <span className="loading-spinner"></span>
                  Creating Account...
                </>
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          <p className="login-link">
            Already have an account? <a href="/LoginPage">Sign in here</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
