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
    <div className="admin-dashboard">
      {/* Top Navbar */}
      <nav className="admin-navbar">
        <div className="admin-navbar-content">
          <div className="admin-navbar-brand">
            <div className="admin-brand-accent"></div>
            <span>Admin Panel</span>
          </div>
          <div className="admin-user-info">
            <div className="admin-user-avatar">
              {(user?.name || "Admin").charAt(0).toUpperCase()}
            </div>
            <span className="admin-greeting-text">
              Hello, {user?.name || "Admin"}
            </span>
          </div>
          <Link to="/" className="admin-logout-btn" onClick={handleLogout}>
            <LogOut size={20} />
            <span>Logout</span>
          </Link>
        </div>
      </nav>

      {/* Center Squares */}
      <div className="admin-squares-container">
        <div className="admin-squares-grid">
          <Link to="/AdminUserManagement" className="admin-square">
            <div className="admin-square-content">
              <div className="admin-square-icon-wrapper">
                <Users className="admin-square-icon" size={32} />
              </div>
              <h3>User Management</h3>
              <p className="admin-square-description">
                Manage user accounts and permissions
              </p>
            </div>
          </Link>

          <Link to="/WorkoutManagement" className="admin-square">
            <div className="admin-square-content">
              <div className="admin-square-icon-wrapper">
                <Dumbbell className="admin-square-icon" size={32} />
              </div>
              <h3>Workouts</h3>
              <p className="admin-square-description">
                Create and manage workout plans
              </p>
            </div>
          </Link>

          <Link to="/DietPlanManagement" className="admin-square">
            <div className="admin-square-content">
              <div className="admin-square-icon-wrapper">
                <Utensils className="admin-square-icon" size={32} />
              </div>
              <h3>Diet Plans</h3>
              <p className="admin-square-description">
                Design nutrition and meal plans
              </p>
            </div>
          </Link>

          <Link to="/BlogManagement" className="admin-square">
            <div className="admin-square-content">
              <div className="admin-square-icon-wrapper">
                <FileText className="admin-square-icon" size={32} />
              </div>
              <h3>Blog Management</h3>
              <p className="admin-square-description">
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
