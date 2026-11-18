import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaEye, FaUserPlus } from "react-icons/fa";
import api from "../../service/api";
import PermissionsModal from "../../components/PermissionsModal/PermissionsModal";
import "./ManageUsers.css";

export default function ManageUsers() {

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    api.get("/users")
      .then((res) => setUsers(res.data))
      .catch((err) => {
        if (err.response?.status === 403) setError("You don't have permission");
        else setError("Failed to load users");
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="spinner" />;
  if (error) return <p className="alert-error">{error}</p>;

  return (
    <div>
      <div className="page-header">
        <div>
          <h2 className="page-title">Manage Users</h2>
          <p className="page-sub">{users.length} users in the system</p>
        </div>

        <Link to="/dashboard/users/add" className="btn btn-primary">
          <FaUserPlus /> Add User
        </Link>
      </div>

      <div className="card table-card">
        <table className="users-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>User</th>
              <th>Phone</th>
              <th>Permissions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                <td data-label="ID" className="cell-id">#{u.id}</td>
                <td data-label="User">
                  <div className="cell-user">
                    <span className="mini-avatar">
                      {u.firstname[0]}{u.lastname[0]}
                    </span>
                    <div>
                      <div className="cell-name">{u.firstname} {u.lastname}</div>
                      <div className="cell-username">@{u.userName}</div>
                    </div>
                  </div>
                </td>
                <td data-label="Phone">{u.phone}</td>
                <td data-label="Permissions">
                  <button
                    className="eye-btn"
                    onClick={() => setSelectedUser(u)}
                    aria-label="Show permissions"
                  >
                    <FaEye />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedUser && (
        <PermissionsModal
          user={selectedUser}
          onClose={() => setSelectedUser(null)}
        />
      )}
    </div>
  );
}
