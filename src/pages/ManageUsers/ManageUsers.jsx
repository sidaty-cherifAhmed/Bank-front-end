import { useEffect, useState } from "react";
import api from "../../service/api";
import { FaEye } from "react-icons/fa";
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

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="error-text">{error}</p>;

  return (
    <div>
      <h2>Manage Users</h2>

      <table className="users-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Username</th>
            <th>Name</th>
            <th>Phone</th>
            <th>Permissions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id}>
              <td>{u.id}</td>
              <td>{u.userName}</td>
              <td>{u.firstname} {u.lastname}</td>
              <td>{u.phone}</td>
              <td>
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

      {selectedUser && (
        <PermissionsModal
          user={selectedUser}
          onClose={() => setSelectedUser(null)}
        />
      )}
    </div>
  );
}