import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit, Save, Plus, Trash } from 'lucide-react';
import axios from 'axios';
import './DietPlanDetail.css';

function DietPlanDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [dietPlan, setDietPlan] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedPlan, setEditedPlan] = useState(null);
  const [selectedDay, setSelectedDay] = useState('monday');
  const [showAddMealModal, setShowAddMealModal] = useState(false);
  const [newMeal, setNewMeal] = useState({
    name: '',
    time: '',
    description: '',
    calories: ''
  });

  const fetchDietPlan = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`/api/diet-plans/${id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (response.data.success) {
        setDietPlan(response.data.data);
        setEditedPlan(response.data.data);
      }
      setError(null);
    } catch (err) {
      setError('Failed to fetch diet plan details');
      console.error('Error fetching diet plan:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDietPlan();
  },[id]);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = async () => {
    try {
      console.log(editedPlan);
      const response = await axios.put(`/api/diet-plans/${id}`, editedPlan, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (response.data.success) {
        setDietPlan(response.data.data);
        setIsEditing(false);
      }
    } catch (err) {
      console.error('Error updating diet plan:', err);
      alert('Failed to update diet plan');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedPlan(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddMeal = async () => {
    try {
      const updatedPlan = { ...editedPlan };
      if (!updatedPlan.dailyDetails[selectedDay]) {
        updatedPlan.dailyDetails[selectedDay] = { meals: [] };
      }
      updatedPlan.dailyDetails[selectedDay].meals.push(newMeal);
      
      const response = await axios.put(`/api/diet-plans/${id}`, updatedPlan, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.data.success) {
        setDietPlan(response.data.data);
        setEditedPlan(response.data.data);
        setShowAddMealModal(false);
        setNewMeal({
          name: '',
          time: '',
          description: '',
          calories: ''
        });
      }
    } catch (err) {
      console.error('Error adding meal:', err);
      alert('Failed to add meal');
    }
  };

  const handleDeleteMeal = async (day, mealIndex) => {
    try {
      const updatedPlan = { ...editedPlan };
      updatedPlan.dailyDetails[day].meals.splice(mealIndex, 1);
      
      const response = await axios.put(`/api/diet-plans/${id}`, updatedPlan, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.data.success) {
        setDietPlan(response.data.data);
        setEditedPlan(response.data.data);
      }
    } catch (err) {
      console.error('Error deleting meal:', err);
      alert('Failed to delete meal');
    }
  };

  if (isLoading) {
    return <div className="loading">Loading diet plan details...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  if (!dietPlan) {
    return <div className="error">Diet plan not found</div>;
  }

  return (
    <div className="diet-plan-detail">
      <div className="back-button-container">
        <button onClick={() => navigate('/DietPlanManagement')} className="back-button">
          <ArrowLeft className="back-icon" />
          <span>Back to Diet Plans</span>
        </button>
      </div>

      <div className="detail-header">
        <div className="header-content">
          {isEditing ? (
            <input
              type="text"
              name="name"
              value={editedPlan.name}
              onChange={handleInputChange}
              className="edit-input"
            />
          ) : (
            <h1>{dietPlan.name}</h1>
          )}
          <div className="header-actions">
            {isEditing ? (
              <button onClick={handleSaveClick} className="save-button">
                <Save className="button-icon" />
                Save Changes
              </button>
            ) : (
              <button onClick={handleEditClick} className="edit-button">
                <Edit className="button-icon" />
                Edit Plan
              </button>
            )}
          </div>
        </div>

        <div className="plan-info">
          <div className="info-item">
            <span className="label">Category:</span>
            {isEditing ? (
              <select
                name="category"
                value={editedPlan.category}
                onChange={handleInputChange}
                className="edit-select"
              >
                <option value="Weight Loss">Weight Loss</option>
                <option value="Muscle Gain">Muscle Gain</option>
                <option value="Keto">Keto</option>
                <option value="Vegan">Vegan</option>
                <option value="Mediterranean">Mediterranean</option>
              </select>
            ) : (
              <span className="value">{dietPlan.category}</span>
            )}
          </div>
          <div className="info-item">
            <span className="label">Daily Calories:</span>
            {isEditing ? (
              <input
                type="number"
                name="dailyCalories"
                value={editedPlan.dailyCalories}
                onChange={handleInputChange}
                className="edit-input"
              />
            ) : (
              <span className="value">{dietPlan.dailyCalories} kcal</span>
            )}
          </div>
          <div className="info-item">
            <span className="label">Meals Per Day:</span>
            {isEditing ? (
              <input
                type="number"
                name="mealsPerDay"
                value={editedPlan.mealsPerDay}
                onChange={handleInputChange}
                min="1"
                max="10"
                className="edit-input"
              />
            ) : (
              <span className="value">{dietPlan.mealsPerDay}</span>
            )}
          </div>
          <div className="info-item">
            <span className="label">Blog Link:</span>
            {isEditing ? (
              <input
                type="url"
                name="blogLink"
                value={editedPlan.blogLink}
                onChange={handleInputChange}
                className="edit-input"
              />
            ) : (
              <a href={`/blog/${dietPlan.blogLink}`} target="_blank" rel="noopener noreferrer" className="blog-link">
                View Blog for more details
              </a>
            )}
          </div>
        </div>
      </div>

      <div className="daily-meals">
        <div className="days-selector">
          {['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].map(day => (
            <button
              key={day}
              className={`day-button ${selectedDay === day ? 'active' : ''}`}
              onClick={() => setSelectedDay(day)}
            >
              {day.charAt(0).toUpperCase() + day.slice(1)}
            </button>
          ))}
        </div>

        <div className="meals-container">
          <div className="meals-header">
            <h2>Meals for {selectedDay.charAt(0).toUpperCase() + selectedDay.slice(1)}</h2>
            <button
              className="add-meal-button"
              onClick={() => setShowAddMealModal(true)}
            >
              <Plus className="button-icon" />
              Add Meal
            </button>
          </div>

          <div className="meals-list">
            {dietPlan.dailyDetails[selectedDay]?.meals?.map((meal, index) => (
              <div key={index} className="meal-card">
                <div className="meal-header">
                <span className="meal-name">{meal.name}</span>
                <span className="meal-time">{meal.time}</span>
                </div>
                <p className="meal-description">{meal.description}</p>
                <div className="meal-footer">
                  <span className="meal-calories">{meal.calories} kcal</span>
                  {isEditing && (
                    <button
                      className="delete-meal-button"
                      onClick={() => handleDeleteMeal(selectedDay, index)}
                    >
                      <Trash className="button-icon" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Add Meal Modal */}
      {showAddMealModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>Add New Meal</h3>
              <button
                className="modal-close"
                onClick={() => setShowAddMealModal(false)}
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label htmlFor="mealName">Meal Name</label>
                <input
                  type="text"
                  id="mealName"
                  value={newMeal.name}
                  onChange={(e) => setNewMeal({ ...newMeal, name: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="mealTime">Time</label>
                <input
                  type="time"
                  id="mealTime"
                  value={newMeal.time}
                  onChange={(e) => setNewMeal({ ...newMeal, time: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="mealDescription">Description</label>
                <textarea
                  id="mealDescription"
                  value={newMeal.description}
                  onChange={(e) => setNewMeal({ ...newMeal, description: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="mealCalories">Calories</label>
                <input
                  type="number"
                  id="mealCalories"
                  value={newMeal.calories}
                  onChange={(e) => setNewMeal({ ...newMeal, calories: e.target.value })}
                  min="0"
                  required
                />
              </div>
              <div className="form-actions">
                <button
                  className="cancel-button"
                  onClick={() => setShowAddMealModal(false)}
                >
                  Cancel
                </button>
                <button
                  className="submit-button"
                  onClick={handleAddMeal}
                >
                  Add Meal
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default DietPlanDetail; 