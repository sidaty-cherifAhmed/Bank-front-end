import { useEffect, useState } from "react";
import { FaEye, FaSearch } from "react-icons/fa";
import api from "../../service/api";
import PermissionsModal from "../../components/PermissionsModal/PermissionsModal";
import { formatDateTime } from "../../utils/format";
import "../ManageUsers/ManageUsers.css";
import "../FindUser/FindUser.css";

export default function LoginRegister() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("");
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    api.get("/login-register")
      .then((res) => setRecords(res.data))
      .catch((err) => {
        if (err.response?.status === 403) setError("You don't have permission");
        else setError("Failed to load login records");
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="spinner" />;
  if (error) return <p className="alert-error">{error}</p>;

  const q = filter.trim().toLowerCase();
  const shown = q
    ? records.filter((r) => r.userName.toLowerCase().includes(q))
    : records;

  return (
    <div>
      <div className="page-header">
        <div>
          <h2 className="page-title">Login Register</h2>
          <p className="page-sub">
            {q
              ? `${shown.length} of ${records.length} records`
              : `${records.length} login records, newest first`}
          </p>
        </div>

        <div className="find-input register-filter">
          <FaSearch />
          <input
            className="input"
            placeholder="Filter by username"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
        </div>
      </div>

      <div className="card table-card">
        <table className="users-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Date and time</th>
              <th>User</th>
              <th>Permissions</th>
            </tr>
          </thead>
          <tbody>
            {shown.length === 0 && (
              <tr>
                <td colSpan="4" className="cell-empty">
                  {q ? "No matching records" : "No login records yet"}
                </td>
              </tr>
            )}
            {shown.map((r) => (
              <tr key={r.id}>
                <td className="cell-id">#{r.id}</td>
                <td className="cell-date">{formatDateTime(r.dateTime)}</td>
                <td>
                  <div className="cell-user">
                    <span className="mini-avatar">
                      {r.userName.slice(0, 2)}
                    </span>
                    <div className="cell-name">@{r.userName}</div>
                  </div>
                </td>
                <td>
                  <button
                    className="eye-btn"
                    onClick={() => setSelected(r)}
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

      {selected && (
        <PermissionsModal
          user={selected}
          onClose={() => setSelected(null)}
        />
      )}
    </div>
  );
}
