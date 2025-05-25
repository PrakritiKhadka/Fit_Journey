import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useUserStore from '../store/user';
import './AdminPanel.css';
import {
  LogOut,
  Gauge,
  Users,
  Dumbbell,
  Utensils,
  FileText
} from 'lucide-react';


function AdminPanel() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };
  const { isAuthenticated, logout, user, error, clearError, checkAuth } =
    useUserStore();

  return (
    <div className="app">
      {/* Top Navbar */}
      <nav className="navbar">
        <div className="navbar-brand">Admin Panel</div>
        <div className="user-info">
          
          <span className="greeting-text">Hello, {user?.name || "Admin"}</span>
        </div>
        <Link to="/" className="logout-btn" onClick={handleLogout}>
          <LogOut size={20} />
          <span>Logout</span>
        </Link>
      </nav>
      
      {/* Center Squares */}
      <div className="squares-container">
        {/* <Link to="/AdminDashboard" className="square">
          <Gauge className="square-icon" size={32} />
          <h3>Dashboard</h3>
        </Link> */}
        <Link to="/AdminUserManagement" className="square">
          <Users className="square-icon" size={32} />
          <h3>User Management</h3>
        </Link>
        <Link to="/WorkoutManagement" className="square">
          <Dumbbell className="square-icon" size={32} />
          <h3>Workouts</h3>
        </Link>
        <Link to="/DietPlanManagement" className="square">
          <Utensils className="square-icon" size={32} />
          <h3>Diet Plans</h3>
        </Link>
        <Link to="/BlogManagement" className="square">
          <FileText className="square-icon" size={32} />
          <h3>Blog Management</h3>
        </Link>
      </div>
    </div>
  );
}

export default AdminPanel;