import { useState } from "react";
import { FaSearch } from "react-icons/fa";
import api from "../../service/api";
import ConfirmModal from "../../components/ConfirmModal/ConfirmModal";
import { formatRate } from "../../utils/format";
import "../ManageUsers/ManageUsers.css";
import "../FindUser/FindUser.css";
import "../AddUser/AddUser.css";
import "../Currencies/Currencies.css";
import "../FindCurrency/FindCurrency.css";
import "./UpdateRate.css";

const BASE_CODE = "USD"; // base of all rates: cannot be changed

export default function UpdateRate() {
  // Step 1: find the code
  const [code, setCode] = useState("");
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState("");

  // Step 2: update the rate
  const [found, setFound] = useState(null); // list of currencies (countries sharing the code)
  const [newRate, setNewRate] = useState("");
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState("");
  const [confirming, setConfirming] = useState(false);
  const [saving, setSaving] = useState(false);

  const currentCode = found?.[0]?.code;
  const isBase = currentCode?.toUpperCase() === BASE_CODE;

  const resetResult = () => {
    setFound(null);
    setNewRate("");
    setErrors({});
    setMessage("");
    setSuccess("");
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setSearchError("");
    resetResult();
    setSearching(true);

    try {
      const { data } = await api.get("/currencies/by-code", {
        params: { code: code.trim() },
      });
      setFound(data);
    } catch (err) {
      const res = err.response;
      if (!res) setSearchError("Cannot connect to server");
      else if (res.status === 404) setSearchError(res.data?.error || "Currency not found");
      else setSearchError("Failed to find the currency");
    } finally {
      setSearching(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors({});
    setMessage("");
    setSuccess("");
    setConfirming(true);
  };

  const handleConfirm = async () => {
    setSaving(true);
    try {
      const { data } = await api.put(`/currencies/${encodeURIComponent(currentCode)}/rate`, {
        rate: newRate,
      });
      setFound(data); // the updated list from the server
      setNewRate("");
      setSuccess(`The ${currentCode} rate was updated successfully`);
    } catch (err) {
      const res = err.response;
      const errCode = res?.data?.error;

      if (!res) setMessage("Cannot connect to server");
      else if (res.status === 403) setMessage("You don't have permission");
      else if (res.status === 404) setMessage(res.data?.error || "Currency not found");
      else if (res.status === 400 && errCode === "BASE_CURRENCY_RATE_LOCKED")
        setMessage(res.data.message);
      else if (res.status === 400) setErrors(res.data); // { rate: message }
      else setMessage("Failed to update the rate");
    } finally {
      setSaving(false);
      setConfirming(false);
    }
  };

  // Confirmation text: mentions the old rate if it is the same across countries
  const oldRates = found ? [...new Set(found.map((c) => Number(c.rate)))] : [];
  const oldText = oldRates.length === 1 ? ` from ${formatRate(oldRates[0])}` : "";
  const n = found?.length ?? 0;
  const confirmMessage =
    `Change the ${currentCode} rate${oldText} to ${newRate ? formatRate(newRate) : ""}? ` +
    (n > 1
      ? `This updates all ${n} countries that use ${currentCode}.`
      : `This updates ${found?.[0]?.country}.`);

  return (
    <div>
      <div className="page-header">
        <div>
          <h2 className="page-title">Update Exchange Rate</h2>
          <p className="page-sub">Find a currency by its code, then set its new rate</p>
        </div>
      </div>

      <form className="find-form" onSubmit={handleSearch}>
        <div className="find-input">
          <FaSearch />
          <input
            className="input upper-input"
            placeholder="Currency code, e.g. EUR"
            maxLength={3}
            value={code}
            onChange={(e) => setCode(e.target.value)}
            autoComplete="off"
            required
          />
        </div>
        <button type="submit" className="btn btn-primary" disabled={searching}>
          {searching ? "Searching..." : "Search"}
        </button>
      </form>

      {searchError && <p className="alert-error find-error">{searchError}</p>}

      {found && (
        <>
          <p className="result-count">
            {n} {n === 1 ? "country uses" : "countries use"} {currentCode}
          </p>

          <div className="card table-card rate-table">
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
                {found.map((c) => (
                  <tr key={c.id}>
                    <td data-label="Country" className="cell-name">{c.country}</td>
                    <td data-label="Code"><span className="code-chip">{c.code}</span></td>
                    <td data-label="Currency">{c.currencyName}</td>
                    <td data-label="Rate (per 1 USD)" className="cell-rate">
                      <span className="rate-base">1 USD =</span> {formatRate(c.rate)}{" "}
                      <span className="rate-code">{c.code}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {isBase ? (
            <p className="alert-error find-error">
              The USD rate is the base of all rates and cannot be changed.
            </p>
          ) : (
            <form className="add-user-form card rate-form" onSubmit={handleSubmit}>
              <div className="form-field">
                <label htmlFor="newRate">New rate (per 1 USD)</label>
                <input
                  id="newRate"
                  className="input amount-input"
                  type="number"
                  min="0.000001"
                  step="0.000001"
                  placeholder="0.00"
                  value={newRate}
                  onChange={(e) => setNewRate(e.target.value)}
                  required
                />
                <span className="field-hint">
                  Up to 6 decimal places. Applies to every country listed above.
                </span>
                {errors.rate && <span className="error-text">{errors.rate}</span>}
              </div>

              {message && <p className="alert-error">{message}</p>}
              {success && <p className="alert-success">{success}</p>}

              <div className="form-actions">
                <button type="submit" className="btn btn-primary">
                  Update rate
                </button>
              </div>
            </form>
          )}
        </>
      )}

      {confirming && (
        <ConfirmModal
          variant="primary"
          title="Confirm new rate"
          message={confirmMessage}
          confirmText="Yes, update"
          loadingText="Updating..."
          loading={saving}
          onConfirm={handleConfirm}
          onCancel={() => setConfirming(false)}
        />
      )}
    </div>
  );
}
