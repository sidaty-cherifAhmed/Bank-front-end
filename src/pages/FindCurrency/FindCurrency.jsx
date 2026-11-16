import { useState } from "react";
import { FaSearch } from "react-icons/fa";
import api from "../../service/api";
import { formatRate } from "../../utils/format";
import "../ManageUsers/ManageUsers.css";
import "../FindUser/FindUser.css";
import "../Currencies/Currencies.css";
import "../../components/ClientSearch/ClientSearch.css"; // تنسيق التبويبات
import "./FindCurrency.css";

// طريقتا البحث: لكل واحدة مسارها ووسيطها في الخادم
const modes = {
  code: {
    label: "By code",
    placeholder: "Currency code, e.g. USD",
    url: "/currencies/by-code",
    param: "code",
    maxLength: 3,
  },
  country: {
    label: "By country",
    placeholder: "Country name, e.g. Japan",
    url: "/currencies/by-country",
    param: "country",
  },
};

export default function FindCurrency() {
  const [mode, setMode] = useState("code");
  const [value, setValue] = useState("");
  const [results, setResults] = useState(null); // null = لم يُبحث بعد
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const switchMode = (next) => {
    setMode(next);
    setValue("");
    setResults(null);
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setResults(null);
    setLoading(true);

    const m = modes[mode];
    try {
      const { data } = await api.get(m.url, { params: { [m.param]: value.trim() } });
      setResults(data);
    } catch (err) {
      const res = err.response;
      if (!res) setError("Cannot connect to server");
      else if (res.status === 404) setError(res.data?.error || "Currency not found");
      else setError("Failed to search currencies");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h2 className="page-title">Find Currency</h2>
          <p className="page-sub">Search by currency code or by country</p>
        </div>
      </div>

      <div className="mode-tabs" role="tablist">
        {Object.entries(modes).map(([key, m]) => (
          <button
            key={key}
            type="button"
            role="tab"
            aria-selected={mode === key}
            className={mode === key ? "mode-tab active" : "mode-tab"}
            onClick={() => switchMode(key)}
          >
            {m.label}
          </button>
        ))}
      </div>

      <form className="find-form" onSubmit={handleSubmit}>
        <div className="find-input">
          <FaSearch />
          <input
            className={mode === "code" ? "input upper-input" : "input"}
            placeholder={modes[mode].placeholder}
            maxLength={modes[mode].maxLength}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            autoComplete="off"
            required
          />
        </div>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? "Searching..." : "Search"}
        </button>
      </form>

      {error && <p className="alert-error find-error">{error}</p>}

      {results && (
        <>
          <p className="result-count">
            {results.length} {results.length === 1 ? "result" : "results"}
          </p>

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
                {results.map((c) => (
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
        </>
      )}
    </div>
  );
}
