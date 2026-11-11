import { useState } from "react";
import { FaSearch } from "react-icons/fa";
import api from "../../service/api";
import ClientCard from "../../components/ClientCard/ClientCard";
import "../FindUser/FindUser.css";
import "./FindClient.css";

// طريقتا البحث: كل واحدة لها مسارها في الخادم
const modes = {
  id: {
    label: "By ID",
    placeholder: "Enter client ID",
    type: "number",
    url: (v) => `/clients/${v}`,
  },
  account: {
    label: "By account number",
    placeholder: "Enter account number",
    type: "text",
    url: (v) => `/clients/account/${encodeURIComponent(v.trim())}`,
  },
};

export default function FindClient() {
  const [mode, setMode] = useState("id");
  const [value, setValue] = useState("");
  const [client, setClient] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const switchMode = (next) => {
    setMode(next);
    setValue("");
    setClient(null);
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setClient(null);
    setLoading(true);

    try {
      const { data } = await api.get(modes[mode].url(value));
      setClient(data);
    } catch (err) {
      const status = err.response?.status;
      if (!err.response) setError("Cannot connect to server");
      else if (status === 404) setError("Client not found");
      else if (status === 403) setError("You don't have permission");
      else setError("Failed to find client");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h2 className="page-title">Find Client</h2>
          <p className="page-sub">Search by client ID or by account number</p>
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
            className="input"
            type={modes[mode].type}
            min={mode === "id" ? "1" : undefined}
            placeholder={modes[mode].placeholder}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? "Searching..." : "Search"}
        </button>
      </form>

      {error && <p className="alert-error find-error">{error}</p>}

      {client && <ClientCard client={client} />}
    </div>
  );
}
