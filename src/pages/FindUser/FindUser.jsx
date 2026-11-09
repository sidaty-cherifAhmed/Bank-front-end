import { useState } from "react";
import { FaEye, FaSearch, FaUser, FaPhone } from "react-icons/fa";
import api from "../../service/api";
import PermissionsModal from "../../components/PermissionsModal/PermissionsModal";
import "./FindUser.css";

export default function FindUser() {
  const [userId, setUserId] = useState("");
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPermissions, setShowPermissions] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setUser(null);
    setLoading(true);

    try {
      const { data } = await api.get(`/users/${userId}`);
      setUser(data);
    } catch (err) {
      const status = err.response?.status;
      if (!err.response) setError("Cannot connect to server");
      else if (status === 404) setError("User not found");
      else if (status === 403) setError("You don't have permission");
      else setError("Failed to find user");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h2 className="page-title">Find User</h2>
          <p className="page-sub">Search for a user by their ID</p>
        </div>
      </div>

      <form className="find-form" onSubmit={handleSubmit}>
        <div className="find-input">
          <FaSearch />
          <input
            className="input"
            type="number"
            min="1"
            placeholder="Enter user ID"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? "Searching..." : "Search"}
        </button>
      </form>

      {error && <p className="alert-error find-error">{error}</p>}

      {user && (
        <div className="user-card card">
          <div className="user-card-top">
            <div className="user-avatar">
              {user.firstname[0]}{user.lastname[0]}
            </div>
            <div>
              <h3>{user.firstname} {user.lastname}</h3>
              <span className="user-badge">ID {user.id}</span>
            </div>
          </div>

          <div className="user-row">
            <FaUser />
            <span className="user-label">Username</span>
            <span className="user-value">{user.userName}</span>
          </div>

          <div className="user-row">
            <FaPhone />
            <span className="user-label">Phone</span>
            <span className="user-value">{user.phone}</span>
          </div>

          <button
            className="perm-btn"
            onClick={() => setShowPermissions(true)}
          >
            <FaEye /> View permissions
          </button>
        </div>
      )}

      {showPermissions && (
        <PermissionsModal
          user={user}
          onClose={() => setShowPermissions(false)}
        />
      )}
    </div>
  );
}
