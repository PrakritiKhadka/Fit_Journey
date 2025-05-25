import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useGoalStore from '../store/goal';
import useUserStore from '../store/user';
import '../styles/SetGoals.css';

const SetGoals = () => {
  const navigate = useNavigate();
  const { goals, loading, error, fetchGoals, createGoal, updateGoal, deleteGoal } = useGoalStore();
  const { user, isAuthenticated, checkAuth } = useUserStore();
  const [newGoal, setNewGoal] = useState({
    title: '',
    type: 'loss',
    targetDate: '',
    currentValue: '',
    targetValue: ''
  });
  const [updateValues, setUpdateValues] = useState({});
  const [localError, setLocalError] = useState(null);

  // Combined authentication and data fetching
  useEffect(() => {
    const initializeComponent = async () => {
      try {
        // Check auth first
        await checkAuth();
        
        // Fetch goals if authenticated
        if (isAuthenticated) {
          await fetchGoals();
        } else {
          navigate('/login');
        }
      } catch (error) {
        console.error('Initialization failed:', error);
        navigate('/login');
      }
    };

    initializeComponent();
  }, [checkAuth, isAuthenticated, fetchGoals, navigate]);

  // Form handling
  const handleInputChange = (e) => {
    const { id, value } = e.target;
    const field = id.replace('goal-', '');
    
    setNewGoal(prev => ({
      ...prev,
      [field]: value,
      // Set initialValue equal to currentValue when that field changes
      ...(field === 'currentValue' ? { initialValue: value } : {})
    }));
  };

  // Form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!validateForm()) return;
    
    try {
      // Parse numeric values
      const goalData = {
        ...newGoal,
        currentValue: parseFloat(newGoal.currentValue),
        targetValue: parseFloat(newGoal.targetValue),
        initialValue: parseFloat(newGoal.currentValue) // Always use current as initial
      };
      
      await createGoal(goalData);
      resetForm();
      await fetchGoals();
    } catch (error) {
      handleError(error, 'Failed to create goal');
    }
  };

  // Update goal value
  const handleUpdateGoal = async (goalId) => {
    const updateValue = updateValues[goalId];
    
    if (!updateValue || isNaN(parseFloat(updateValue)) || parseFloat(updateValue) < 0) {
      setLocalError('Please enter a valid positive number');
      return;
    }
    
    try {
      await updateGoal(goalId, parseFloat(updateValue));
      
      // Clear just this update value
      setUpdateValues(prev => {
        const newValues = {...prev};
        delete newValues[goalId];
        return newValues;
      });
      
      setLocalError(null);
      await fetchGoals();
    } catch (error) {
      handleError(error, 'Failed to update goal');
    }
  };

  // Delete goal
  const handleDeleteGoal = async (goalId) => {
    if (!window.confirm('Are you sure you want to delete this goal?')) return;
    
    try {
      await deleteGoal(goalId);
    } catch (error) {
      handleError(error, 'Failed to delete goal');
    }
  };

  // Helper functions
  const validateForm = () => {
    if (!newGoal.title.trim()) {
      setLocalError('Title is required');
      return false;
    }
    if (!newGoal.targetDate) {
      setLocalError('Target date is required');
      return false;
    }
    if (isNaN(parseFloat(newGoal.currentValue)) || parseFloat(newGoal.currentValue) < 0) {
      setLocalError('Current value must be a positive number');
      return false;
    }
    if (isNaN(parseFloat(newGoal.targetValue)) || parseFloat(newGoal.targetValue) < 0) {
      setLocalError('Target value must be a positive number');
      return false;
    }
    
    setLocalError(null);
    return true;
  };

  const resetForm = () => {
    setNewGoal({
      title: '',
      type: 'loss',
      targetDate: '',
      currentValue: '',
      targetValue: ''
    });
  };

  const handleError = (error, defaultMessage) => {
    console.error('Error:', error);
    setLocalError(error.response?.data?.message || defaultMessage);
    
    if (error.response?.status === 401) {
      navigate('/login');
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Not set';
    
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      return 'Invalid date';
    }
  };

  const calculateProgress = (goal) => {
    // For maintain goals
    if (goal.type === 'maintain') {
      const difference = Math.abs(goal.currentValue - goal.targetValue);
      const percentDifference = (difference / goal.targetValue) * 100;
      return percentDifference <= 2 ? 100 : 0;
    }
    
    // For weight loss
    if (goal.type === 'loss') {
      if (goal.currentValue <= goal.targetValue) return 100;
      
      const initial = goal.initialValue || goal.currentValue;
      const diff = initial - goal.currentValue;
      const totalNeeded = initial - goal.targetValue;
      
      return Math.min(100, Math.max(0, Math.round((diff / totalNeeded) * 100)));
    }
    
    // For muscle gain
    if (goal.type === 'gain') {
      if (goal.currentValue >= goal.targetValue) return 100;
      
      const initial = goal.initialValue || goal.currentValue;
      const diff = goal.currentValue - initial;
      const totalNeeded = goal.targetValue - initial;
      
      return Math.min(100, Math.max(0, Math.round((diff / totalNeeded) * 100)));
    }
    
    return 0;
  };

  const getProgressColor = (progress) => {
    if (progress >= 80) return 'progress-high';
    if (progress >= 40) return 'progress-medium';
    return 'progress-low';
  };

  // Loading state
  if (loading) return <div className="loading">Loading goals...</div>;

  return (
    <div className="container">
      <header>
        <h1>Fitness Goals Tracker</h1>
        {user && <p>Welcome, {user.name}!</p>}
      </header>
      
      {/* Error display */}
      {(error || localError) && (
        <div className="error-banner">
          {error || localError}
          <button onClick={() => setLocalError(null)} className="close-error">×</button>
        </div>
      )}
      
      {/* Create goal form */}
      <div className="goal-section">
        <h2>Set New Goal</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="goal-title">Goal Title</label>
            <input 
              type="text" 
              id="goal-title" 
              value={newGoal.title}
              onChange={handleInputChange}
              required
              placeholder="Enter goal title"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="goal-type">Goal Type</label>
            <select 
              id="goal-type" 
              value={newGoal.type}
              onChange={handleInputChange}
              required
            >
              <option value="loss">Weight Loss</option>
              <option value="gain">Muscle Gain</option>
              <option value="maintain">Maintain</option>
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="goal-targetDate">Target Date</label>
            <input 
              type="date" 
              id="goal-targetDate"
              value={newGoal.targetDate}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="goal-currentValue">Current Value</label>
            <input 
              type="number" 
              id="goal-currentValue" 
              value={newGoal.currentValue}
              onChange={handleInputChange}
              required
              placeholder="Current value (e.g., 180 lbs)"
              min="0"
              step="0.1"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="goal-targetValue">Target Value</label>
            <input 
              type="number" 
              id="goal-targetValue" 
              value={newGoal.targetValue}
              onChange={handleInputChange}
              required
              placeholder="Target value (e.g., 160 lbs)"
              min="0"
              step="0.1"
            />
          </div>
          
          <button type="submit" className="btn">Save Goal</button>
        </form>
      </div>
      
      {/* Goals list */}
      <div className="goal-section">
        <h2>Your Goals</h2>
        {goals.length === 0 ? (
          <div className="no-goals">You haven't set any goals yet. Create one above to get started!</div>
        ) : (
          <div className="goals-list">
            {goals.map(goal => {
              const progress = calculateProgress(goal);
              return (
                <div className="goal-card" key={goal._id}>
                  <div className="goal-header">
                    <h3>{goal.title}</h3>
                    <button 
                      className="delete-btn"
                      onClick={() => handleDeleteGoal(goal._id)}
                      aria-label="Delete goal"
                    >
                      ×
                    </button>
                  </div>
                  
                  <div className="goal-meta">
                    <span className={`goal-type ${goal.type}`}>
                      {goal.type.charAt(0).toUpperCase() + goal.type.slice(1)}
                    </span>
                    <span className="goal-date">
                      Target: {formatDate(goal.targetDate)}
                    </span>
                  </div>
                  
                  <div className="goal-values">
                    {goal.initialValue && goal.initialValue !== goal.currentValue && (
                      <span>Started: {goal.initialValue} → </span>
                    )}
                    Current: {goal.currentValue} 
                    {goal.type !== 'maintain' && ` → Target: ${goal.targetValue}`}
                  </div>
                  
                  <div className="goal-progress">
                    <div className="progress-bar">
                      <div 
                        className={`progress-fill ${getProgressColor(progress)}`}
                        style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
                      >
                        <span className="progress-text">{progress}%</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="update-section">
                    <input
                      type="number"
                      className="update-input"
                      placeholder="Update current value"
                      value={updateValues[goal._id] ?? ''}
                      onChange={(e) => setUpdateValues({
                        ...updateValues,
                        [goal._id]: e.target.value
                      })}
                      min="0"
                      step="0.1"
                    />
                    <button 
                      className="update-btn"
                      onClick={() => handleUpdateGoal(goal._id)}
                      disabled={!updateValues[goal._id]}
                    >
                      Update
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default SetGoals;