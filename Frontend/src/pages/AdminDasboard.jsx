import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useUserStore from '../store/user';
import '../styles/AdminDashboard.css';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user } = useUserStore();
  const [activeTab, setActiveTab] = useState('dashboard');

  // Check if user is admin
  if (!user || user.role !== 'admin') {
    return (
      <div className="admin-error">
        <h2>Access Denied</h2>
        <p>You do not have permission to access this page.</p>
        <button onClick={() => navigate('/')}>Return to Home</button>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <div className="admin-sidebar">
        <h2>Admin Panel</h2>
        <nav>
          <button 
            className={activeTab === 'dashboard' ? 'active' : ''} 
            onClick={() => setActiveTab('dashboard')}
          >
            Dashboard
          </button>
          <button 
            className={activeTab === 'users' ? 'active' : ''} 
            onClick={() => setActiveTab('users')}
          >
            User Management
          </button>
          <button 
            className={activeTab === 'blogs' ? 'active' : ''} 
            onClick={() => setActiveTab('blogs')}
          >
            Blog Management
          </button>
          <button 
            className={activeTab === 'workouts' ? 'active' : ''} 
            onClick={() => setActiveTab('workouts')}
          >
            Workout Management
          </button>
          <button 
            className={activeTab === 'goals' ? 'active' : ''} 
            onClick={() => setActiveTab('goals')}
          >
            Goals Management
          </button>
        </nav>
      </div>

      <div className="admin-content">
        {activeTab === 'dashboard' && (
          <div className="dashboard-overview">
            <h2>Dashboard Overview</h2>
            <div className="stats-grid">
              <div className="stat-card">
                <h3>Total Users</h3>
                <p>Loading...</p>
              </div>
              <div className="stat-card">
                <h3>Total Workouts</h3>
                <p>Loading...</p>
              </div>
              <div className="stat-card">
                <h3>Total Goals</h3>
                <p>Loading...</p>
              </div>
              <div className="stat-card">
                <h3>Total Blogs</h3>
                <p>Loading...</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'blogs' && (
          <div className="blog-management">
            <h2>Blog Management</h2>
            <div className="action-bar">
              <button className="create-button">Create New Blog</button>
            </div>
            <div className="blog-list">
              <table>
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Author</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Loading blogs...</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="user-management">
            <h2>User Management</h2>
            <div className="user-list">
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Loading users...</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'workouts' && (
          <div className="workout-management">
            <h2>Workout Management</h2>
            <div className="action-bar">
              <button className="create-button">Create New Workout</button>
            </div>
            <div className="workout-list">
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Type</th>
                    <th>Difficulty</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Loading workouts...</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'goals' && (
          <div className="goals-management">
            <h2>Goals Management</h2>
            <div className="action-bar">
              <button className="create-button">Create New Goal Template</button>
            </div>
            <div className="goals-list">
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Category</th>
                    <th>Difficulty</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Loading goals...</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
