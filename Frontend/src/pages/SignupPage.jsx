import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import useUserStore from '../store/user';
import '../styles/SignupPage.css';

const SignupPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [signupError, setSignupError] = useState('');
  
  const { register, googleSignUp, isLoading, isAuthenticated, error, clearError } = useUserStore();
  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/FitJourneyDashboard');
    }
  }, [isAuthenticated, navigate]);

  // Display store error if present
  useEffect(() => {
    if (error) {
      setSignupError(error);
    }
    // Clear the signup error when component unmounts
    return () => {
      clearError();
    };
  }, [error, clearError]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const validateForm = () => {
    // Check for required fields
    if (!formData.name || !formData.age || !formData.gender || !formData.email || !formData.password) {
      setSignupError('All fields are required');
      return false;
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setSignupError('Please enter a valid email address');
      return false;
    }
    
    // Validate age
    const age = parseInt(formData.age, 10);
    if (isNaN(age) || age < 13) {
      setSignupError('You must be at least 13 years old to register');
      return false;
    }
    
    // Validate password length
    if (formData.password.trim().length < 8) {
      setSignupError('Password must be at least 8 characters long');
      return false;
    }
    
    // Validate password confirmation
    if (formData.password !== formData.confirmPassword) {
      setSignupError('Passwords do not match');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSignupError('');
    
    if (!validateForm()) {
      return;
    }
    
    try {
      // eslint-disable-next-line no-unused-vars
      const { confirmPassword, ...userData } = formData;

      userData.age = parseInt(userData.age, 10);
      
      await register(userData);
    } catch (error) {
      console.error('Registration error caught in component:', error);
      setSignupError(error.message || 'Registration failed. Please try again.');
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      await googleSignUp(credentialResponse.credential);
    } catch (error) {
      console.error('Google signup component error:', error);
      setSignupError('Google signup failed. Please try again.');
    }
  };

  const handleGoogleError = () => {
    console.error('Google signup failed');
    setSignupError('Google signup failed. Please try again.');
  };

  return (
    <div className="signup-container">
      <div className="signup-card">
        <h1>Create Account</h1>
        
        {signupError && <div className="error-message">{signupError}</div>}
        
        <div className="social-signup">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={handleGoogleError}
            useOneTap
            text="signup_with"
            shape="rectangular"
            theme="filled_blue"
          />
        </div>
        
        <div className="divider">
          <span>or</span>
        </div>
        
        <form onSubmit={handleSubmit}>
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
            <label htmlFor="age">Age</label>
            <input
              type="number"
              id="age"
              name="age"
              value={formData.age}
              onChange={handleChange}
              required
              min="13"
              placeholder="Must be 13 or older"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="gender">Gender</label>
            <select
              id="gender"
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              required
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="non-binary">Non-binary</option>
              <option value="prefer-not-to-say">Prefer not to say</option>
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="email">Email</label>
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
          
          <button 
            type="submit" 
            className="signup-btn"
            disabled={isLoading}
          >
            {isLoading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>
        
        <p className="login-link">
          Already have an account? <a href="/LoginPage">Log in</a>
        </p>
      </div>
    </div>
  );
};

export default SignupPage;