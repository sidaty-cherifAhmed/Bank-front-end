import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaUserPlus } from "react-icons/fa";
import api from "../../service/api";
import { hasPermission, Permissions } from "../../utils/permissions";
import { formatMoney, initials } from "../../utils/format";
import "../ManageUsers/ManageUsers.css";

export default function ClientList() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api.get("/clients")
      .then((res) => setClients(res.data))
      .catch((err) => {
        if (err.response?.status === 403) setError("You don't have permission");
        else setError("Failed to load clients");
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="spinner" />;
  if (error) return <p className="alert-error">{error}</p>;

  const total = clients.reduce((sum, c) => sum + Number(c.balance), 0);

  return (
    <div>
      <div className="page-header">
        <div>
          <h2 className="page-title">Clients</h2>
          <p className="page-sub">
            {clients.length} clients · total balance {formatMoney(total)}
          </p>
        </div>

        {hasPermission(Permissions.ADD_NEW_CLIENT) && (
          <Link to="/dashboard/clients/add" className="btn btn-primary">
            <FaUserPlus /> Add Client
          </Link>
        )}
      </div>

      <div className="card table-card">
        <table className="users-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Client</th>
              <th>Account</th>
              <th>Phone</th>
              <th>Balance</th>
            </tr>
          </thead>
          <tbody>
            {clients.length === 0 && (
              <tr>
                <td colSpan="5" className="cell-empty">No clients yet</td>
              </tr>
            )}
            {clients.map((c) => (
              <tr key={c.id}>
                <td data-label="ID" className="cell-id">#{c.id}</td>
                <td data-label="Client">
                  <div className="cell-user">
                    <span className="mini-avatar">{initials(c.clientName)}</span>
                    <div>
                      <div className="cell-name">{c.clientName}</div>
                      <div className="cell-username">{c.email}</div>
                    </div>
                  </div>
                </td>
                <td data-label="Account">{c.accountNumber}</td>
                <td data-label="Phone">{c.phone}</td>
                <td data-label="Balance" className="cell-money">{formatMoney(c.balance)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
