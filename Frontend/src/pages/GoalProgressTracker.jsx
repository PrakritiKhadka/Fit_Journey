import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/GoalProgressTracker.css';

const GoalProgressTracker = () => {
  const [goals, setGoals] = useState([]);
  const [newGoal, setNewGoal] = useState({ title: '', targetValue: 100, currentValue: 0, unit: '%' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch goals from backend
  useEffect(() => {
    const fetchGoals = async () => {
      try {
        setLoading(true);
        // Assuming your backend has an endpoint /api/goals
        const token = localStorage.getItem('token');
        const response = await axios.get('/api/goals', {
          headers: { 'x-auth-token': token }
        });
        setGoals(response.data);
        setError(null);
      } catch (err) {
        setError('Failed to fetch goals. Please try again.');
        console.error('Error fetching goals:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchGoals();
  }, []);

  // Add a new goal
  const handleAddGoal = async (e) => {
    e.preventDefault();
    
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('/api/goals', newGoal, {
        headers: { 'x-auth-token': token }
      });
      
      setGoals([...goals, response.data]);
      setNewGoal({ title: '', targetValue: 100, currentValue: 0, unit: '%' });
    } catch (err) {
      setError('Failed to add goal. Please try again.');
      console.error('Error adding goal:', err);
    }
  };

  // Update goal progress
  const handleUpdateProgress = async (goalId, newValue) => {
    try {
      // Validate input
      const numValue = parseFloat(newValue);
      if (isNaN(numValue)) return;
      
      const updatedGoals = goals.map(goal => {
        if (goal._id === goalId) {
          return { ...goal, currentValue: numValue };
        }
        return goal;
      });
      
      setGoals(updatedGoals);
      
      // Update on backend
      const token = localStorage.getItem('token');
      await axios.patch(`/api/goals/${goalId}`, { currentValue: numValue }, {
        headers: { 'x-auth-token': token }
      });
    } catch (err) {
      setError('Failed to update progress. Please try again.');
      console.error('Error updating goal:', err);
    }
  };

  // Delete a goal
  const handleDeleteGoal = async (goalId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`/api/goals/${goalId}`, {
        headers: { 'x-auth-token': token }
      });
      
      setGoals(goals.filter(goal => goal._id !== goalId));
    } catch (err) {
      setError('Failed to delete goal. Please try again.');
      console.error('Error deleting goal:', err);
    }
  };

  // Calculate progress percentage
  const calculatePercentage = (current, target) => {
    const percentage = (current / target) * 100;
    return Math.min(Math.max(percentage, 0), 100); // Clamp between 0-100
  };

  return (
    <div className="goal-tracker-container">
      <h1>Goal Progress Tracker</h1>
      
      {error && <div className="error-message">{error}</div>}
      
      {/* Add new goal form */}
      <div className="goal-form-container">
        <h2>Add New Goal</h2>
        <form onSubmit={handleAddGoal} className="goal-form">
          <div className="form-group">
            <label>Goal Title</label>
            <input 
              type="text" 
              value={newGoal.title}
              onChange={(e) => setNewGoal({...newGoal, title: e.target.value})}
              placeholder="Enter goal title"
              required
            />
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label>Target Value</label>
              <input 
                type="number" 
                value={newGoal.targetValue}
                onChange={(e) => setNewGoal({...newGoal, targetValue: parseFloat(e.target.value)})}
                min="1"
                required
              />
            </div>
            
            <div className="form-group">
              <label>Current Value</label>
              <input 
                type="number" 
                value={newGoal.currentValue}
                onChange={(e) => setNewGoal({...newGoal, currentValue: parseFloat(e.target.value)})}
                min="0"
                required
              />
            </div>
            
            <div className="form-group">
              <label>Unit</label>
              <select 
                value={newGoal.unit}
                onChange={(e) => setNewGoal({...newGoal, unit: e.target.value})}
              >
                <option value="%">Percentage (%)</option>
                <option value="kg">Kilograms (kg)</option>
                <option value="hrs">Hours (hrs)</option>
                <option value="steps">Steps</option>
                <option value="miles">Miles</option>
                <option value="$">Dollars ($)</option>
                <option value="">None</option>
              </select>
            </div>
          </div>
          
          <button type="submit" className="btn-add-goal">Add Goal</button>
        </form>
      </div>
      
      {/* Goals list */}
      <div className="goals-list-container">
        <h2>Your Goals</h2>
        
        {loading ? (
          <div className="loading-spinner">Loading...</div>
        ) : goals.length === 0 ? (
          <div className="no-goals-message">
            <p>You haven't set any goals yet. Add your first goal above!</p>
          </div>
        ) : (
          <div className="goals-list">
            {goals.map(goal => {
              const progressPercentage = calculatePercentage(goal.currentValue, goal.targetValue);
              
              return (
                <div key={goal._id} className="goal-card">
                  <div className="goal-header">
                    <h3>{goal.title}</h3>
                    <button 
                      className="btn-delete" 
                      onClick={() => handleDeleteGoal(goal._id)}
                    >
                      ×
                    </button>
                  </div>
                  
                  <div className="goal-progress">
                    <div className="progress-bar-container">
                      <div 
                        className="progress-bar-fill" 
                        style={{ width: `${progressPercentage}%` }}
                      ></div>
                    </div>
                    <div className="progress-text">
                      {goal.currentValue} / {goal.targetValue} {goal.unit}
                    </div>
                  </div>
                  
                  <div className="progress-percentage">
                    {Math.round(progressPercentage)}% Complete
                  </div>
                  
                  <div className="goal-update-form">
                    <label>Update Progress:</label>
                    <div className="update-input-container">
                      <input 
                        type="number"
                        defaultValue={goal.currentValue}
                        min="0"
                        max={goal.targetValue}
                        onBlur={(e) => handleUpdateProgress(goal._id, e.target.value)}
                      />
                      <span className="unit-label">{goal.unit}</span>
                    </div>
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

export default GoalProgressTracker;