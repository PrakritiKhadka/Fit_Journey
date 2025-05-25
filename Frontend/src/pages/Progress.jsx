import React, { useState } from 'react';
import '../styles/ProgressView.css';

const ProgressView = ({ 
  steps = 5,
  currentStep = 2, 
  labels = [], 
  completed = false,
  color = '#4f46e5',
  showPercentage = true,
  animated = true,
  vertical = false,
  className = ''
}) => {
  // Calculate percentage
  const percentage = Math.min(Math.max(Math.round((currentStep / steps) * 100), 0), 100);
  
  return (
    <div className={`progress-tracker ${vertical ? 'vertical' : 'horizontal'} ${className}`}>
      {showPercentage && (
        <div className="progress-percentage">
          <span>{percentage}%</span>
          {completed && <span className="completed-text">Completed</span>}
        </div>
      )}
      
      <div className="progress-bar-container">
        <div 
          className={`progress-bar ${animated ? 'animated' : ''}`} 
          style={{ 
            [vertical ? 'height' : 'width']: `${percentage}%`,
            backgroundColor: color
          }}
        />
        
        {/* Display steps markers if there are labels */}
        {labels.length > 0 && (
          <div className="step-markers">
            {labels.map((label, index) => {
              const stepPercentage = ((index) / (labels.length - 1)) * 100;
              const isActive = (index + 1) <= currentStep;
              
              return (
                <div 
                  key={index}
                  className={`step-marker ${isActive ? 'active' : ''}`}
                  style={{ 
                    [vertical ? 'bottom' : 'left']: `${stepPercentage}%`,
                    borderColor: isActive ? color : '#e5e7eb',
                    backgroundColor: isActive ? color : '#ffffff'
                  }}
                >
                  <span className="step-label">{label}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

// Example component that demonstrates different progress view usage
const ProgressViewDemo = () => {
  const [progress, setProgress] = useState(3);
  const [verticalProgress, setVerticalProgress] = useState(2);
  
  // Sample progress labels
  const horizontalLabels = ['Start', 'Planning', 'Development', 'Testing', 'Deployment'];
  const verticalLabels = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];
  
  // Function to increment progress
  const incrementProgress = () => {
    setProgress(prev => prev < horizontalLabels.length ? prev + 1 : prev);
  };
  
  // Function to decrement progress
  const decrementProgress = () => {
    setProgress(prev => prev > 0 ? prev - 1 : prev);
  };
  
  // Function to increment vertical progress
  const incrementVerticalProgress = () => {
    setVerticalProgress(prev => prev < verticalLabels.length ? prev + 1 : prev);
  };
  
  // Function to decrement vertical progress
  const decrementVerticalProgress = () => {
    setVerticalProgress(prev => prev > 0 ? prev - 1 : prev);
  };
  
  return (
    <div className="progress-demo">
      <h2>Horizontal Progress View</h2>
      <ProgressView 
        steps={horizontalLabels.length}
        currentStep={progress}
        labels={horizontalLabels}
        completed={progress === horizontalLabels.length}
        color="#4f46e5"
      />
      
      <div className="controls">
        <button onClick={decrementProgress}>Previous Step</button>
        <button onClick={incrementProgress}>Next Step</button>
      </div>
      
      <h2>Vertical Progress View</h2>
      <div className="vertical-demo">
        <ProgressView 
          steps={verticalLabels.length}
          currentStep={verticalProgress}
          labels={verticalLabels}
          completed={verticalProgress === verticalLabels.length}
          color="#16a34a"
          vertical={true}
        />
        
        <div className="vertical-controls">
          <button onClick={decrementVerticalProgress}>Previous Level</button>
          <button onClick={incrementVerticalProgress}>Next Level</button>
        </div>
      </div>
      
      <h2>Simple Progress Bar (No Labels)</h2>
      <ProgressView 
        steps={10}
        currentStep={7}
        color="#f59e0b"
      />
      
      <h2>Completed Progress</h2>
      <ProgressView 
        steps={5}
        currentStep={5}
        completed={true}
        color="#10b981"
      />
    </div>
  );
};

export default ProgressView;
export { ProgressViewDemo };