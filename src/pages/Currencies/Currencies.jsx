import { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import api from "../../service/api";
import { formatRate } from "../../utils/format";
import "../ManageUsers/ManageUsers.css";
import "../FindUser/FindUser.css";
import "./Currencies.css";

export default function Currencies() {
  const [currencies, setCurrencies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("");

  useEffect(() => {
    api.get("/currencies")
      .then((res) => setCurrencies(res.data))
      .catch((err) => {
        if (!err.response) setError("Cannot connect to server");
        else setError("Failed to load currencies");
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="spinner" />;
  if (error) return <p className="alert-error">{error}</p>;

  // القائمة محمّلة كاملة، فالبحث في المتصفح صحيح هنا
  const q = filter.trim().toLowerCase();
  const shown = q
    ? currencies.filter(
        (c) =>
          c.country.toLowerCase().includes(q) ||
          c.code.toLowerCase().includes(q) ||
          c.currencyName.toLowerCase().includes(q)
      )
    : currencies;

  return (
    <div>
      <div className="page-header">
        <div>
          <h2 className="page-title">Currencies</h2>
          <p className="page-sub">
            {q
              ? `${shown.length} of ${currencies.length} currencies`
              : `${currencies.length} currencies · rates against 1 USD`}
          </p>
        </div>

        <div className="find-input register-filter">
          <FaSearch />
          <input
            className="input"
            placeholder="Search country, code or name"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
        </div>
      </div>

      <div className="card table-card">
        <table className="users-table">
          <thead>
            <tr>
              <th>Country</th>
              <th>Code</th>
              <th>Currency</th>
              <th className="th-right">Rate (per 1 USD)</th>
            </tr>
          </thead>
          <tbody>
            {shown.length === 0 && (
              <tr>
                <td colSpan="4" className="cell-empty">
                  {q ? "No matching currencies" : "No currencies yet"}
                </td>
              </tr>
            )}
            {shown.map((c) => (
              <tr key={c.id}>
                <td className="cell-name">{c.country}</td>
                <td><span className="code-chip">{c.code}</span></td>
                <td>{c.currencyName}</td>
                <td className="cell-rate">
                  <span className="rate-base">1 USD =</span> {formatRate(c.rate)}{" "}
                  <span className="rate-code">{c.code}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
