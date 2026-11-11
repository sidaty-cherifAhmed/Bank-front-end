import { useEffect, useState } from "react";
import { FaEye, FaSearch, FaTimes } from "react-icons/fa";
import api from "../../service/api";
import PermissionsModal from "../../components/PermissionsModal/PermissionsModal";
import { formatDateTime } from "../../utils/format";
import "../ManageUsers/ManageUsers.css";
import "../FindUser/FindUser.css";
import "../AddUser/AddUser.css";
import "./LoginRegister.css";

export default function LoginRegister() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState(null);

  // فلتر الاسم يعمل في المتصفح، وفلتر التاريخ يُرسل للخادم
  const [filter, setFilter] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [dateError, setDateError] = useState("");
  const [searched, setSearched] = useState(false);

  // يجلب السجلات. (حالة loading تُفعَّل من الأزرار، وهي true أصلاً عند أول فتح)
  const load = (fromValue, toValue) => {
    // قيمة datetime-local تأتي بدون ثوانٍ: نجعل "من" بداية الدقيقة و"إلى" نهايتها
    const params = {};
    if (fromValue) params.from = `${fromValue}:00`;
    if (toValue) params.to = `${toValue}:59`;

    return api.get("/login-register", { params })
      .then((res) => setRecords(res.data))
      .catch((err) => {
        const status = err.response?.status;
        if (!err.response) setError("Cannot connect to server");
        else if (status === 403) setError("You don't have permission");
        else if (status === 400) setError("Invalid date or time");
        else setError("Failed to load login records");
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load("", "");
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    setDateError("");

    if (from && to && from > to) {
      setDateError("The start date must be before the end date");
      return;
    }

    setSearched(Boolean(from || to));
    setError("");
    setLoading(true);
    load(from, to);
  };

  const handleClear = () => {
    setFrom("");
    setTo("");
    setDateError("");
    setSearched(false);
    setError("");
    setLoading(true);
    load("", "");
  };

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
            {loading
              ? "Loading..."
              : q
                ? `${shown.length} of ${records.length} records`
                : `${records.length} login records${searched ? " in the selected period" : ", newest first"}`}
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

      <form className="card date-filter" onSubmit={handleSearch}>
        <div className="form-field">
          <label htmlFor="from">From</label>
          <input
            id="from"
            type="datetime-local"
            className="input"
            value={from}
            max={to || undefined}
            onChange={(e) => setFrom(e.target.value)}
          />
        </div>

        <div className="form-field">
          <label htmlFor="to">To</label>
          <input
            id="to"
            type="datetime-local"
            className="input"
            value={to}
            min={from || undefined}
            onChange={(e) => setTo(e.target.value)}
          />
        </div>

        <div className="date-filter-actions">
          <button type="submit" className="btn btn-primary" disabled={loading}>
            <FaSearch /> Search
          </button>
          {(from || to || searched) && (
            <button type="button" className="btn btn-ghost" onClick={handleClear}>
              <FaTimes /> Clear
            </button>
          )}
        </div>
      </form>

      {dateError && <p className="alert-error date-error">{dateError}</p>}
      {error && <p className="alert-error date-error">{error}</p>}

      {loading ? (
        <div className="spinner" />
      ) : (
        !error && (
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
                      {q || searched ? "No matching records" : "No login records yet"}
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
        )
      )}

      {selected && (
        <PermissionsModal
          user={selected}
          onClose={() => setSelected(null)}
        />
      )}
    </div>
  );
}
