import { useEffect, useMemo, useState } from "react";
import { FaExchangeAlt, FaCalculator } from "react-icons/fa";
import api from "../../service/api";
import { formatConverted, formatRate } from "../../utils/format";
import "../AddUser/AddUser.css";
import "../../components/TransactionPage/TransactionPage.css";
import "../Transfer/Transfer.css";
import "./CurrencyCalculator.css";

export default function CurrencyCalculator() {
  const [currencies, setCurrencies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  const [from, setFrom] = useState("USD");
  const [to, setTo] = useState("");
  const [amount, setAmount] = useState("");

  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [converting, setConverting] = useState(false);

  useEffect(() => {
    api.get("/currencies")
      .then((res) => setCurrencies(res.data))
      .catch((err) => {
        if (!err.response) setLoadError("Cannot connect to server");
        else setLoadError("Failed to load currencies");
      })
      .finally(() => setLoading(false));
  }, []);

  // One code per currency (EUR, for example, belongs to several countries), sorted by code
  const options = useMemo(() => {
    const byCode = new Map();
    currencies.forEach((c) => {
      if (!byCode.has(c.code)) byCode.set(c.code, c.currencyName);
    });
    return [...byCode.entries()].map(([code, name]) => ({ code, name }));
  }, [currencies]);

  // If no target is chosen yet: the first currency different from the source
  const target = to || options.find((o) => o.code !== from)?.code || "";

  const swap = () => {
    setFrom(target);
    setTo(from);
    setResult(null);
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setResult(null);
    setConverting(true);

    try {
      const { data } = await api.get("/currencies/convert", {
        params: { from, to: target, amount },
      });
      setResult(data);
    } catch (err) {
      const res = err.response;
      if (!res) setError("Cannot connect to server");
      else if (res.status === 404) setError(res.data?.error || "Currency not found");
      else if (res.status === 400) setError(res.data?.message || "Invalid amount");
      else setError("Conversion failed");
    } finally {
      setConverting(false);
    }
  };

  const select = (id, label, value, onChange) => (
    <div className="form-field">
      <label htmlFor={id}>{label}</label>
      <select
        id={id}
        className="input"
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
          setResult(null);
          setError("");
        }}
      >
        {options.map((o) => (
          <option key={o.code} value={o.code}>
            {o.code} — {o.name}
          </option>
        ))}
      </select>
    </div>
  );

  if (loading) return <div className="spinner" />;
  if (loadError) return <p className="alert-error">{loadError}</p>;

  return (
    <div>
      <div className="page-header">
        <div>
          <h2 className="page-title">Currency Calculator</h2>
          <p className="page-sub">Convert an amount from one currency to another</p>
        </div>
      </div>

      <form className="add-user-form card" onSubmit={handleSubmit}>
        <div className="form-field">
          <label htmlFor="amount">Amount</label>
          <input
            id="amount"
            className="input amount-input"
            type="number"
            min="0.01"
            step="any"
            placeholder="0.00"
            value={amount}
            onChange={(e) => {
              setAmount(e.target.value);
              setResult(null);
            }}
            required
          />
        </div>

        <div className="transfer-accounts">
          {select("from", "From", from, setFrom)}

          <button
            type="button"
            className="swap-btn"
            onClick={swap}
            aria-label="Swap currencies"
            title="Swap currencies"
          >
            <FaExchangeAlt />
          </button>

          {select("to", "To", target, setTo)}
        </div>

        {error && <p className="alert-error">{error}</p>}

        <div className="form-actions">
          <button type="submit" className="btn btn-primary" disabled={converting || !target}>
            <FaCalculator /> {converting ? "Converting..." : "Convert"}
          </button>
        </div>
      </form>

      {result && (
        <div className="calc-result card">
          <span className="calc-label">
            {formatConverted(result.amount)} {result.fromCode} =
          </span>
          <strong className="calc-value">
            {formatConverted(result.result)} <small>{result.toCode}</small>
          </strong>
          <span className="calc-rate">
            1 {result.fromCode} = {formatRate(result.exchangeRate)} {result.toCode}
          </span>
        </div>
      )}
    </div>
  );
}
