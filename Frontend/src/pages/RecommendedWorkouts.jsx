import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/RecommendedWorkouts.css';

const RecommendedWorkouts = () => {
  const navigate = useNavigate();
  const [workouts, setWorkouts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWorkouts = async () => {
      try {
        const response = await fetch('/api/workouts/stats', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch workouts');
        }
        
        setWorkouts(data.data.filter(w => w.totalUsage > 0));
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchWorkouts();
  }, []);

  const handleUseWorkout = async (workoutId) => {
    try {
      const response = await fetch(`/api/workouts/admin/${workoutId}/use`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to use workout');
      }

      // Navigate back to dashboard after using workout
      navigate('/dashboard');
    } catch (err) {
      console.error('Error using workout:', err);
      alert('Failed to use workout: ' + err.message);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (isLoading) {
    return <div className="loading">Loading recommended workouts...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  return (
    <div className="recommended-workouts">
      <div className="page-header">
        <h1>Recommended Workouts</h1>
        <button className="back-btn" onClick={() => navigate('/dashboard')}>
          Back to Dashboard
        </button>
      </div>

      <div className="workouts-grid">
        {workouts.map((workout) => (
          <div key={workout._id} className="workout-card">
            <div className="workout-header">
              <h3>{workout._id}</h3>
              <span className="usage-badge">
                Used {workout.totalUsage} times
              </span>
            </div>
            
            <div className="workout-details">
              <div className="detail-item">
                <span className="label">Last Used:</span>
                <span className="value">
                  {workout.lastUsed ? formatDate(workout.lastUsed) : 'Never'}
                </span>
              </div>
              <div className="detail-item">
                <span className="label">Total Workouts:</span>
                <span className="value">{workout.count}</span>
              </div>
            </div>

            <button 
              className="use-workout-btn"
              onClick={() => handleUseWorkout(workout._id)}
            >
              Use This Workout
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecommendedWorkouts; 