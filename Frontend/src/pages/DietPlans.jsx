import React, { useState, useEffect } from 'react';
import { Search, Filter, ChevronDown, Heart, HeartOff } from 'lucide-react';
import axios from 'axios';
import './DietPlans.css';

function DietPlans() {
  const [dietPlans, setDietPlans] = useState([]);
  const [subscribedPlan, setSubscribedPlan] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDietPlans();
    fetchSubscribedPlan();
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

  const fetchSubscribedPlan = async () => {
    try {
      const response = await axios.get('/api/users/me', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (response.data.data.subscribedDietPlan) {
        setSubscribedPlan(response.data.data.subscribedDietPlan);
      }
    } catch (err) {
      console.error('Error fetching subscribed plan:', err);
    }
  };

  const handleSubscribe = async (planId) => {
    try {
      await axios.post(`/api/diet-plans/${planId}/subscribe`, {}, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      await fetchSubscribedPlan();
      await fetchDietPlans(); // Refresh to update subscriber count
    } catch (err) {
      console.error('Error subscribing to diet plan:', err);
      alert('Failed to subscribe to diet plan');
    }
  };

  const handleUnsubscribe = async (planId) => {
    try {
      await axios.post(`/api/diet-plans/${planId}/unsubscribe`, {}, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      setSubscribedPlan(null);
      await fetchDietPlans(); // Refresh to update subscriber count
    } catch (err) {
      console.error('Error unsubscribing from diet plan:', err);
      alert('Failed to unsubscribe from diet plan');
    }
  };

  const filteredPlans = dietPlans.filter(plan => {
    const matchesSearch = plan.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         plan.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || plan.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

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

  if (isLoading) {
    return <div className="loading">Loading diet plans...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="diet-plans-page">
      <div className="page-header">
        <h1>Diet Plans</h1>
        <p>Find the perfect diet plan to achieve your fitness goals</p>
      </div>

      <div className="filters-section">
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

        <div className="category-filter">
          <button className="filter-button">
            <Filter className="filter-icon" />
            <span>Category</span>
            <ChevronDown className="dropdown-icon" />
          </button>
          <div className="category-dropdown">
            <button
              className={`category-option ${selectedCategory === 'all' ? 'active' : ''}`}
              onClick={() => setSelectedCategory('all')}
            >
              All Categories
            </button>
            <button
              className={`category-option ${selectedCategory === 'Weight Loss' ? 'active' : ''}`}
              onClick={() => setSelectedCategory('Weight Loss')}
            >
              Weight Loss
            </button>
            <button
              className={`category-option ${selectedCategory === 'Muscle Gain' ? 'active' : ''}`}
              onClick={() => setSelectedCategory('Muscle Gain')}
            >
              Muscle Gain
            </button>
            <button
              className={`category-option ${selectedCategory === 'Keto' ? 'active' : ''}`}
              onClick={() => setSelectedCategory('Keto')}
            >
              Keto
            </button>
            <button
              className={`category-option ${selectedCategory === 'Vegan' ? 'active' : ''}`}
              onClick={() => setSelectedCategory('Vegan')}
            >
              Vegan
            </button>
            <button
              className={`category-option ${selectedCategory === 'Mediterranean' ? 'active' : ''}`}
              onClick={() => setSelectedCategory('Mediterranean')}
            >
              Mediterranean
            </button>
          </div>
        </div>
      </div>

      {subscribedPlan && (
        <div className="subscribed-plan">
          <h2>Your Current Diet Plan</h2>
          <div className="plan-card featured">
            <div className="plan-header">
              <h3>{subscribedPlan.name}</h3>
              <span className={`category-badge ${getCategoryColor(subscribedPlan.category)}`}>
                {subscribedPlan.category}
              </span>
            </div>
            <div className="plan-details">
              <div className="detail-item">
                <span className="label">Daily Calories:</span>
                <span className="value">{subscribedPlan.dailyCalories} kcal</span>
              </div>
              <div className="detail-item">
                <span className="label">Meals Per Day:</span>
                <span className="value">{subscribedPlan.mealsPerDay}</span>
              </div>
            </div>
            <div className="plan-actions">
              <a
                href={subscribedPlan.blogLink}
                target="_blank"
                rel="noopener noreferrer"
                className="blog-link"
              >
                View Detailed Plan
              </a>
              <button
                className="unsubscribe-button"
                onClick={() => handleUnsubscribe(subscribedPlan._id)}
              >
                <HeartOff className="button-icon" />
                Unsubscribe
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="plans-grid">
        {filteredPlans.map(plan => (
          <div key={plan._id} className="plan-card">
            <div className="plan-header">
              <h3>{plan.name}</h3>
              <span className={`category-badge ${getCategoryColor(plan.category)}`}>
                {plan.category}
              </span>
            </div>
            <div className="plan-details">
              <div className="detail-item">
                <span className="label">Daily Calories:</span>
                <span className="value">{plan.dailyCalories} kcal</span>
              </div>
              <div className="detail-item">
                <span className="label">Meals Per Day:</span>
                <span className="value">{plan.mealsPerDay}</span>
              </div>
              <div className="detail-item">
                <span className="label">Subscribers:</span>
                <span className="value">{plan.subscribers?.length || 0}</span>
              </div>
            </div>
            <div className="plan-actions">
              <a
                href={plan.blogLink}
                target="_blank"
                rel="noopener noreferrer"
                className="blog-link"
              >
                View Details
              </a>
              {subscribedPlan?._id === plan._id ? (
                <button
                  className="unsubscribe-button"
                  onClick={() => handleUnsubscribe(plan._id)}
                >
                  <HeartOff className="button-icon" />
                  Unsubscribe
                </button>
              ) : (
                <button
                  className="subscribe-button"
                  onClick={() => handleSubscribe(plan._id)}
                >
                  <Heart className="button-icon" />
                  Subscribe
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredPlans.length === 0 && (
        <div className="no-plans">
          <p>No diet plans found matching your criteria.</p>
        </div>
      )}
    </div>
  );
}

export default DietPlans; 