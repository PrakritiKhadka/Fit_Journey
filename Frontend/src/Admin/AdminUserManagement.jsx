import { useState, useEffect } from "react";
import { Trash, Edit, Check, X, Search, ArrowLeft } from "lucide-react";
import axios from "axios";
import "./AdminUserManagement.css";
import useUserStore from "../store/user";

export default function AdminUserManagement() {
  const { isAuthenticated, logout, user, err, clearError, checkAuth } =
    useUserStore();

  // State management
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch users on component mount
  useEffect(() => {
    fetchUsers();
  }, []);

  // Fetch users from API
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/api/admin/users");
      setUsers(response.data);
      setError(null);
    } catch (err) {
      setError("Failed to fetch users. Please try again later.");
      console.error("Error fetching users:", err);
    } finally {
      setLoading(false);
    }
  };

  // Filtered users based on search term
  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle editing user
  const handleEdit = (user) => {
    setEditingUser({ ...user });
  };

  // Handle saving edited user
  const handleSaveEdit = async () => {
    try {
      const response = await axios.put(`/api/admin/users/${editingUser._id}`, {
        name: editingUser.name,
        age: editingUser.age,
        gender: editingUser.gender,
      });

      setUsers(
        users.map((user) =>
          user._id === editingUser._id ? response.data.user : user
        )
      );
      setEditingUser(null);
    } catch (err) {
      alert("Failed to update user. Please try again.");
      console.error("Error updating user:", err);
    }
  };

  // Handle deleting user
  const handleDelete = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) {
      return;
    }

    try {
      await axios.delete(`/api/admin/users/${userId}`);
      setUsers(users.filter((user) => user._id !== userId));
    } catch (err) {
      alert("Failed to delete user. Please try again.");
      console.error("Error deleting user:", err);
    }
  };

  // Handle edit form input changes
  const handleEditChange = (field, value) => {
    setEditingUser({
      ...editingUser,
      [field]:
        field === "age" ? (value === "" ? "" : parseInt(value) || 0) : value,
    });
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return <div className="loading">Loading users...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="admin-container">
      <nav className="navbar">
        <div className="navbar-brand">
          <div className="back-button-container">
            <a href="/AdminPanel">Admin Panel</a>
          </div>
        </div>
        <div className="user-info">
          <span className="greeting-text">Hello, {user?.name || "Admin"}</span>
        </div>
      </nav>

      {/* Back Button */}
      <div className="back-button-container">
        <a href="/AdminPanel" className="back-button">
          <ArrowLeft className="back-icon" />
          <span>Go Back</span>
        </a>
      </div>
      <h1 className="admin-title">Admin User Management</h1>

      {/* Search Bar */}
      <div className="search-container">
        <Search className="search-icon" />
        <input
          type="text"
          placeholder="Search users..."
          className="search-input"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Users Table */}
      <div className="users-table-container">
        <table className="users-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Age</th>
              <th>Gender</th>
              <th>Email</th>
              <th>Goal</th>
              <th>Joined Date</th>
              <th className="actions-header">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length === 0 ? (
              <tr>
                <td colSpan="6" className="no-users">
                  No users found
                </td>
              </tr>
            ) : (
              filteredUsers.map((user) => (
                <tr key={user._id}>
                  {editingUser && editingUser._id === user._id ? (
                    // Edit mode row
                    <>
                      <td>
                        <input
                          type="text"
                          value={editingUser.name}
                          onChange={(e) =>
                            handleEditChange("name", e.target.value)
                          }
                          className="edit-input"
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          value={editingUser.age}
                          onChange={(e) =>
                            handleEditChange("age", e.target.value)
                          }
                          className="edit-input"
                          min="0"
                          max="120"
                        />
                      </td>
                      <td>
                        <select
                          value={editingUser.gender}
                          onChange={(e) =>
                            handleEditChange("gender", e.target.value)
                          }
                          className="edit-select"
                        >
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                          <option value="non-binary">Non-binary</option>
                          <option value="prefer-not-to-say">
                            Prefer not to say
                          </option>
                        </select>
                      </td>
                      <td>{user.email}</td>
                      <td>{formatDate(user.createdAt)}</td>
                      <td className="actions-cell">
                        <button
                          onClick={handleSaveEdit}
                          className="confirm-btn"
                        >
                          <Check size={18} />
                        </button>
                        <button
                          onClick={() => setEditingUser(null)}
                          className="cancel-icon-btn"
                        >
                          <X size={18} />
                        </button>
                      </td>
                    </>
                  ) : (
                    // View mode row
                    <>
                      <td>{user.name}</td>
                      <td>{user.age}</td>
                      <td>{user.gender}</td>
                      <td>{user.email}</td>
                      <td>{user.goal ? `${user.goal / 1000} kcal / month` : "No goals set"}</td>
                      <td>{formatDate(user.createdAt)}</td>
                      <td className="actions-cell">
                        <button
                          onClick={() => handleEdit(user)}
                          className="edit-btn"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(user._id)}
                          className="delete-btn"
                        >
                          <Trash size={18} />
                        </button>
                      </td>
                    </>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
        <div className="table-footer">
          <p className="user-count">Total users: {users.length}</p>
        </div>
      </div>
    </div>
  );
}
