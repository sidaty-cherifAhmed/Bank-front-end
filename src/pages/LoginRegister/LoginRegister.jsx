import { useEffect, useState } from "react";
import { FaEye, FaSearch, FaTimes } from "react-icons/fa";
import api from "../../service/api";
import PermissionsModal from "../../components/PermissionsModal/PermissionsModal";
import Pagination from "../../components/Pagination/Pagination";
import { formatDateTime } from "../../utils/format";
import "../ManageUsers/ManageUsers.css";
import "../AddUser/AddUser.css";
import "./LoginRegister.css";

const DEFAULT_SIZE = 20;

export default function LoginRegister() {
  // حقول الإدخال (لم تُطبَّق بعد حتى يضغط المستخدم Search)
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [dateError, setDateError] = useState("");

  // الاستعلام المطبَّق: أي تغيير فيه يجلب بيانات جديدة من الخادم
  const [query, setQuery] = useState({ from: "", to: "", page: 0, size: DEFAULT_SIZE });

  // النتيجة تحمل معها الاستعلام الذي جاءت من أجله.
  // إن اختلف عن الاستعلام الحالي فنحن في حالة تحميل.
  const [result, setResult] = useState({ query: null, data: null, error: "" });
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    let cancelled = false; // لتجاهل ردٍّ متأخر لاستعلام قديم

    // قيمة datetime-local بلا ثوانٍ: "من" بداية الدقيقة و"إلى" نهايتها
    const params = { page: query.page, size: query.size };
    if (query.from) params.from = `${query.from}:00`;
    if (query.to) params.to = `${query.to}:59`;

    api.get("/login-register", { params })
      .then((res) => {
        if (!cancelled) setResult({ query, data: res.data, error: "" });
      })
      .catch((err) => {
        if (cancelled) return;
        const status = err.response?.status;
        let error = "Failed to load login records";
        if (!err.response) error = "Cannot connect to server";
        else if (status === 403) error = "You don't have permission";
        else if (status === 400) error = "Invalid date or time range";
        setResult({ query, data: null, error });
      });

    return () => {
      cancelled = true;
    };
  }, [query]);

  const loading = result.query !== query;
  const { data, error } = result;
  const searched = Boolean(query.from || query.to);

  const handleSearch = (e) => {
    e.preventDefault();
    setDateError("");

    if (from && to && from > to) {
      setDateError("The start date must be before the end date");
      return;
    }
    setQuery((q) => ({ ...q, from, to, page: 0 }));
  };

  const handleClear = () => {
    setFrom("");
    setTo("");
    setDateError("");
    setQuery((q) => ({ ...q, from: "", to: "", page: 0 }));
  };

  const goToPage = (page) => setQuery((q) => ({ ...q, page }));
  const changeSize = (size) => setQuery((q) => ({ ...q, size, page: 0 }));

  const records = data?.content ?? [];

  return (
    <div>
      <div className="page-header">
        <div>
          <h2 className="page-title">Login Register</h2>
          <p className="page-sub">
            {data
              ? `${data.totalElements} login records${searched ? " in the selected period" : ", newest first"}`
              : "Loading..."}
          </p>
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
      {error && !loading && <p className="alert-error date-error">{error}</p>}

      {loading && !data ? (
        <div className="spinner" />
      ) : (
        !error && (
          <>
            <div className={loading ? "card table-card is-loading" : "card table-card"}>
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
                  {records.length === 0 && (
                    <tr>
                      <td colSpan="4" className="cell-empty">
                        {searched ? "No records in this period" : "No login records yet"}
                      </td>
                    </tr>
                  )}
                  {records.map((r) => (
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

            {data && (
              <Pagination
                page={data.page}
                size={data.size}
                totalPages={data.totalPages}
                totalElements={data.totalElements}
                disabled={loading}
                onPageChange={goToPage}
                onSizeChange={changeSize}
              />
            )}
          </>
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
