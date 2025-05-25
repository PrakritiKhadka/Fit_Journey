import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Plus, 
  Filter, 
  ChevronDown,
  Edit,
  Trash,
  AlertCircle,
  Utensils,
  ArrowLeft,
  ExternalLink
} from 'lucide-react';
import './DietPlanManagement.css';
import axios from 'axios';

function DietPlanManagement() {
  const [dietPlans, setDietPlans] = useState([]);
  const [stats, setStats] = useState({
    totalDietPlans: 0,
    subscribedDietPlans: 0
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [planToDelete, setPlanToDelete] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    fetchDietPlans();
    fetchStats();
  }, []);

  const fetchDietPlans = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get('/api/diet-plans', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      setDietPlans(response.data.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch diet plans');
      console.error('Error fetching diet plans:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await axios.get('/api/diet-plans/stats', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (response.data.success) {
        setStats(response.data.data);
      }
    } catch (err) {
      console.error('Error fetching stats:', err);
    }
  };
  
  const handleDeleteClick = (plan) => {
    setPlanToDelete(plan);
    setShowDeleteConfirm(true);
  };
  
  const confirmDelete = async () => {
    if (planToDelete) {
      try {
        const response = await axios.delete(`/api/diet-plans/${planToDelete._id}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        
        if (response.data.success) {
          setDietPlans(dietPlans.filter(plan => plan._id !== planToDelete._id));
          setShowDeleteConfirm(false);
          setPlanToDelete(null);
          fetchStats(); // Refresh stats after deletion
        }
      } catch (err) {
        console.error('Error deleting diet plan:', err);
        alert('Failed to delete diet plan');
      }
    }
  };
  
  const cancelDelete = () => {
    setShowDeleteConfirm(false);
    setPlanToDelete(null);
  };

  const handleEditClick = (plan) => {
    setSelectedPlan(plan);
    setShowEditModal(true);
  };

  const handleCreateClick = () => {
    setSelectedPlan(null);
    setShowCreateModal(true);
  };

  const handleViewDetails = (plan) => {
    // Navigate to diet plan details page
    window.location.href = `/diet-plans/${plan._id}`;
  };
  
  const filteredDietPlans = dietPlans.filter(plan => 
    plan.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    plan.category.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Map categories to color classes
  const getCategoryColor = (category) => {
    switch(category) {
      case 'Weight Loss': return 'category-weight-loss';
      case 'Muscle Gain': return 'category-muscle-gain';
      case 'Keto': return 'category-keto';
      case 'Vegan': return 'category-vegan';
      case 'Mediterranean': return 'category-mediterranean';
      default: return 'category-default';
    }
  };
  
  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = {
        name: e.target.name.value,
        category: e.target.category.value,
        dailyCalories: parseInt(e.target.dailyCalories.value),
        mealsPerDay: parseInt(e.target.mealsPerDay.value),
        blogLink: e.target.blogLink.value
      };

      const response = await axios.post('/api/diet-plans', formData, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.data.success) {
        setShowCreateModal(false);
        fetchDietPlans(); // Refresh the list
        fetchStats(); // Refresh stats
      }
    } catch (err) {
      console.error('Error creating diet plan:', err);
      alert('Failed to create diet plan');
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = {
        _id: selectedPlan._id,
        name: e.target.name.value,
        category: e.target.category.value,
        dailyCalories: parseInt(e.target.dailyCalories.value),
        mealsPerDay: parseInt(e.target.mealsPerDay.value),
        blogLink: e.target.blogLink.value
      };
      const response = await axios.put(`/api/diet-plans/${selectedPlan._id}`, formData, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.data.success) {
        setShowEditModal(false);
        setSelectedPlan(null);
        fetchDietPlans(); // Refresh the list
        fetchStats(); // Refresh stats
      }
    } catch (err) {
      console.error('Error updating diet plan:', err);
      alert('Failed to update diet plan');
    }
  };

  return (
    <div className="diet-plan-management">
      <div className="back-button-container">
        <a href="/AdminPanel" className="back-button">
          <ArrowLeft className="back-icon" />
          <span>Go Back</span>
        </a>
      </div>

      {/* Stats Cards */}
      <div className="cards-container">
        <div className="info-card">
          <div className="icon-container blue">
            <Utensils className="icon blue-icon" />
          </div>
          <div>
            <p className="card-label">Total Diet Plans</p>
            <p className="card-value">{stats.totalDietPlans || 0}</p>
          </div>
        </div>
        
        <div className="info-card">
          <div className="icon-container green">
            <Utensils className="icon green-icon" />
          </div>
          <div>
            <p className="card-label">Subscribed Plans</p>
            <p className="card-value">{stats.subscribedDietPlans || 0}</p>
          </div>
        </div>
      </div>
      
      {/* Actions Bar */}
      <div className="actions-bar">
        <div className="search-container">
          <div className="search-icon-wrapper">
            <Search className="search-icon" />
          </div>
          <input
            type="text"
            placeholder="Search diet plans..."
            className="search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <button className="add-button" onClick={handleCreateClick}>
          <Plus className="button-icon" />
          <span>Add Diet Plan</span>
        </button>
      </div>
      
      {/* Diet Plan List */}
      <div className="table-container">
        <div className="table-scroll">
          <table className="diet-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Category</th>
                <th>Daily Calories</th>
                <th>Meals Per Day</th>
                <th>No of times Subscribed</th>
                <th>Blog Link</th>
                <th className="actions-column">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan="7" className="loading-cell">Loading diet plans...</td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan="7" className="error-cell">{error}</td>
                </tr>
              ) : filteredDietPlans.length === 0 ? (
                <tr>
                  <td colSpan="7" className="empty-cell">No diet plans found</td>
                </tr>
              ) : (
                filteredDietPlans.map((plan) => (
                  <tr key={plan._id} className="table-row">
                    <td>
                      <div className="plan-name">{plan.name}</div>
                    </td>
                    <td>
                      <div className={`category-badge ${getCategoryColor(plan.category)}`}>
                        {plan.category}
                      </div>
                    </td>
                    <td className="diet-info">
                      {plan.dailyCalories} kcal
                    </td>
                    <td className="diet-info">
                      {plan.mealsPerDay}
                    </td>
                    <td className="diet-info">
                      {plan.subscribers?.length || 0}
                    </td>
                    <td>
                      <a 
                        href={`/blog/${plan.blogLink}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="blog-link"
                      >
                        <ExternalLink size={16} />
                        View Blog
                      </a>
                    </td>
                    <td className="actions-cell">
                      <button 
                        className="action-button view"
                        onClick={() => handleViewDetails(plan)}
                      >
                        View
                      </button>
                      <button 
                        className="action-button edit"
                        onClick={() => handleEditClick(plan)}
                      >
                        <Edit className="small-icon" />
                      </button>
                      <button 
                        className="action-button delete"
                        onClick={() => handleDeleteClick(plan)}
                      >
                        <Trash className="small-icon" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <AlertCircle className="alert-icon" />
              <h3 className="modal-title">Confirm Deletion</h3>
            </div>
            <p className="modal-text">
              Are you sure you want to delete diet plan <span className="font-semibold">{planToDelete?.name}</span>? 
              This action cannot be undone.
            </p>
            <div className="modal-actions">
              <button 
                className="cancel-button"
                onClick={cancelDelete}
              >
                Cancel
              </button>
              <button 
                className="confirm-delete-button"
                onClick={confirmDelete}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create/Edit Modal */}
      {(showCreateModal || showEditModal) && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3 className="modal-title">
                {showCreateModal ? 'Create Diet Plan' : 'Edit Diet Plan'}
              </h3>
              <button 
                className="modal-close"
                onClick={() => {
                  setShowCreateModal(false);
                  setShowEditModal(false);
                  setSelectedPlan(null);
                }}
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              <form 
                className="diet-plan-form"
                onSubmit={showCreateModal ? handleCreateSubmit : handleEditSubmit}
              >
                <div className="form-group">
                  <label htmlFor="name">Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    defaultValue={selectedPlan?.name}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="category">Category</label>
                  <select id="category" name="category" defaultValue={selectedPlan?.category} required>
                    <option value="">Select Category</option>
                    <option value="Weight Loss">Weight Loss</option>
                    <option value="Muscle Gain">Muscle Gain</option>
                    <option value="Keto">Keto</option>
                    <option value="Vegan">Vegan</option>
                    <option value="Mediterranean">Mediterranean</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="dailyCalories">Daily Calories</label>
                  <input
                    type="number"
                    id="dailyCalories"
                    name="dailyCalories"
                    defaultValue={selectedPlan?.dailyCalories}
                    min="0"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="mealsPerDay">Meals Per Day</label>
                  <input
                    type="number"
                    id="mealsPerDay"
                    name="mealsPerDay"
                    defaultValue={selectedPlan?.mealsPerDay}
                    min="1"
                    max="10"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="blogLink">Blog Link</label>
                  <input
                    type="text"
                    id="blogLink"
                    name="blogLink"
                    defaultValue={selectedPlan?.blogLink}
                    required
                  />
                </div>
                <div className="form-actions">
                  <button 
                    type="button"
                    className="cancel-button"
                    onClick={() => {
                      setShowCreateModal(false);
                      setShowEditModal(false);
                      setSelectedPlan(null);
                    }}
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="submit-button"
                  >
                    {showCreateModal ? 'Create' : 'Save Changes'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default DietPlanManagement;