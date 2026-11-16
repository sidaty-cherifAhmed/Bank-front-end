import { useState } from "react";
import { FaSearch, FaTrash } from "react-icons/fa";
import api from "../../service/api";
import UserCard from "../../components/UserCard/UserCard";
import ConfirmModal from "../../components/ConfirmModal/ConfirmModal";
import "../FindUser/FindUser.css";

export default function DeleteUser() {
  const [userId, setUserId] = useState("");
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Step 1: find the user and show them before deleting
  const handleSearch = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
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

  // Step 2: delete after confirmation
  const handleDelete = async () => {
    setDeleting(true);
    setError("");

    try {
      await api.delete(`/users/${user.id}`);
      setSuccess(`User "${user.userName}" was deleted successfully`);
      setUser(null);
      setUserId("");
    } catch (err) {
      const res = err.response;
      if (!res) setError("Cannot connect to server");
      else if (res.status === 403) setError("You don't have permission");
      else if (res.status === 404) setError("User not found");
      else if (res.status === 409) setError(res.data.message);
      else setError("Failed to delete user");
    } finally {
      setDeleting(false);
      setConfirming(false);
    }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h2 className="page-title">Delete User</h2>
          <p className="page-sub">Find the user by ID, then confirm the deletion</p>
        </div>
      </div>

      <form className="find-form" onSubmit={handleSearch}>
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
      {success && <p className="alert-success find-error">{success}</p>}

      {user && (
        <UserCard user={user}>
          <button className="btn btn-danger" onClick={() => setConfirming(true)}>
            <FaTrash /> Delete user
          </button>
        </UserCard>
      )}

      {confirming && (
        <ConfirmModal
          title="Delete this user?"
          message={`${user.firstname} ${user.lastname} (@${user.userName}) will be permanently removed. This cannot be undone.`}
          confirmText="Yes, delete"
          loadingText="Deleting..."
          loading={deleting}
          onConfirm={handleDelete}
          onCancel={() => setConfirming(false)}
        />
      )}
    </div>
  );
}
