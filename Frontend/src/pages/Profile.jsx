import React, { useState, useEffect } from 'react';
import useUserStore from '../store/user';
import '../styles/Profile.css';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const navigate = useNavigate();
  const { user, isLoading: isUserLoading, error: userError, updateProfile, loadUser } = useUserStore();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    age: '',
    gender: ''
  });
  const [error, setError] = useState(null);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  // Load user data when component mounts
  useEffect(() => {
    loadUser();
  }, []);

  // Update form data when user data is loaded
  useEffect(() => {
    if (user && !isEditing) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        age: user.age || '',
        gender: user.gender || 'prefer-not-to-say'
      });
    }
  }, [user, isEditing]);

  // Auto-hide success popup after 3 seconds
  useEffect(() => {
    let timeoutId;
    if (showSuccessPopup) {
      timeoutId = setTimeout(() => {
        setShowSuccessPopup(false);
      }, 3000);
    }
    return () => clearTimeout(timeoutId);
  }, [showSuccessPopup]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'age' ? (value === '' ? '' : parseInt(value, 10) || '') : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Make sure we're passing valid data to updateProfile
      const validFormData = {
        ...formData,
        age: formData.age === '' ? null : formData.age // Handle empty age field
      };
      
      await updateProfile(validFormData);
      setIsEditing(false);
      setError(null);
      setShowSuccessPopup(true);
    } catch (err) {
      console.error("Profile update error:", err);
      setError(err.response?.data?.message || 'Failed to update profile');
    }
  };

  const handleCancel = () => {
    // Reset form data to current user data
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        age: user.age || '',
        gender: user.gender || 'prefer-not-to-say'
      });
    }
    setIsEditing(false);
    setError(null);
  };

  const handleBackToDashboard = () => {
    navigate('/FitJourneyDashboard');
  };

  if (isUserLoading) {
    return (
      <div className="profile-loading">
        <div className="loading-text">Loading profile...</div>
      </div>
    );
  }

  if (userError || error) {
    return (
      <div className="profile-error">
        Error: {userError || error}
        <button onClick={() => setError(null)} className="retry-button">
          Try Again
        </button>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="profile-error">
        No user data available. Please log in.
      </div>
    );
  }

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="profile-container">
      {/* Success Popup */}
      {showSuccessPopup && (
        <div className="success-popup">
          <div className="success-popup-content">
            <span className="success-icon">✓</span>
            <p>Profile updated successfully!</p>
            <button 
              onClick={() => setShowSuccessPopup(false)} 
              className="close-popup-button"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      <button onClick={handleBackToDashboard} className="back-button">
        ← Back to Dashboard
      </button>

      <div className="profile-header">
        <h1 className="profile-title">User Profile</h1>
        {!isEditing ? (
          <button 
            onClick={() => setIsEditing(true)} 
            className="edit-button"
            type="button"
          >
            ✎ Edit Profile
          </button>
        ) : (
          <div className="action-buttons">
            <button 
              onClick={handleSubmit} 
              className="save-button"
              type="button"
            >
              ✓ Save
            </button>
            <button 
              onClick={handleCancel} 
              className="cancel-button"
              type="button"
            >
              ✕ Cancel
            </button>
          </div>
        )}
      </div>

      {!isEditing ? (
        <div className="profile-details">
          <div className="profile-row">
            <div className="profile-label">Name</div>
            <div className="profile-value">{user.name}</div>
          </div>
          
          <div className="profile-row">
            <div className="profile-label">Age</div>
            <div className="profile-value">{user.age || 'Not specified'}</div>
          </div>
          
          <div className="profile-row">
            <div className="profile-label">Gender</div>
            <div className="profile-value">
              {user.gender ? user.gender.charAt(0).toUpperCase() + user.gender.slice(1) : 'Not specified'}
            </div>
          </div>
          
          <div className="profile-row">
            <div className="profile-label">Email</div>
            <div className="profile-value">{user.email}</div>
          </div>
          
          <div className="profile-row">
            <div className="profile-label">Account Type</div>
            <div className="profile-value capitalize">
              {user.authMethod || 'Standard'}
            </div>
          </div>
          
          <div className="profile-row">
            <div className="profile-label">Member Since</div>
            <div className="profile-value">
              {formatDate(user.createdAt)}
            </div>
          </div>
        </div>
      ) : (
        <form className="profile-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="name">
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="age">
              Age
            </label>
            <input
              type="number"
              id="age"
              name="age"
              value={formData.age}
              onChange={handleChange}
              className="form-input"
              min="13"
              max="120"
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="gender">
              Gender
            </label>
            <select
              id="gender"
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="form-select"
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="non-binary">Non-binary</option>
              <option value="prefer-not-to-say">Prefer not to say</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="email">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="form-input"
              required
              disabled={user.authMethod === 'google'}
            />
            {user.authMethod === 'google' && (
              <p className="form-note">
                Email cannot be changed for Google-authenticated accounts
              </p>
            )}
          </div>
          
          {/* Adding a submit button within the form for better accessibility */}
          {isEditing && (
            <div className="form-actions" style={{ display: 'none' }}>
              <button type="submit" hidden>Submit</button>
            </div>
          )}
        </form>
      )}
    </div>
  );
};

export default Profile;