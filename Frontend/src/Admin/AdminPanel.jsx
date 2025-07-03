import React from "react";
import { Link, useNavigate } from "react-router-dom";
import useUserStore from "../store/user";
import "./AdminPanel.css";
import {
  LogOut,
  Gauge,
  Users,
  Dumbbell,
  Utensils,
  FileText,
} from "lucide-react";

function AdminPanel() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };
  const { isAuthenticated, logout, user, error, clearError, checkAuth } =
    useUserStore();

  return (
    <div className="app">
      {/* Top Navbar */}
      <nav className="navbar">
        <div className="navbar-content">
          <div className="navbar-brand">
            <div className="brand-accent"></div>
            <span>Admin Panel</span>
          </div>
          <div className="user-info">
            <div className="user-avatar">
              {(user?.name || "Admin").charAt(0).toUpperCase()}
            </div>
            <span className="greeting-text">
              Hello, {user?.name || "Admin"}
            </span>
          </div>
          <Link to="/" className="logout-btn" onClick={handleLogout}>
            <LogOut size={20} />
            <span>Logout</span>
          </Link>
        </div>
      </nav>

      {/* Center Squares */}
      <div className="squares-container">
        <div className="squares-grid">
          <Link to="/AdminUserManagement" className="square">
            <div className="square-content">
              <div className="square-icon-wrapper">
                <Users className="square-icon" size={32} />
              </div>
              <h3>User Management</h3>
              <p className="square-description">
                Manage user accounts and permissions
              </p>
            </div>
          </Link>

          <Link to="/WorkoutManagement" className="square">
            <div className="square-content">
              <div className="square-icon-wrapper">
                <Dumbbell className="square-icon" size={32} />
              </div>
              <h3>Workouts</h3>
              <p className="square-description">
                Create and manage workout plans
              </p>
            </div>
          </Link>

          <Link to="/DietPlanManagement" className="square">
            <div className="square-content">
              <div className="square-icon-wrapper">
                <Utensils className="square-icon" size={32} />
              </div>
              <h3>Diet Plans</h3>
              <p className="square-description">
                Design nutrition and meal plans
              </p>
            </div>
          </Link>

          <Link to="/BlogManagement" className="square">
            <div className="square-content">
              <div className="square-icon-wrapper">
                <FileText className="square-icon" size={32} />
              </div>
              <h3>Blog Management</h3>
              <p className="square-description">
                Publish and manage blog content
              </p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default AdminPanel;
