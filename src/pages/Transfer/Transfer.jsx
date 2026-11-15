import { useState } from "react";
import { FaCheck, FaExchangeAlt, FaArrowRight } from "react-icons/fa";
import api from "../../service/api";
import ConfirmModal from "../../components/ConfirmModal/ConfirmModal";
import { formatMoney } from "../../utils/format";
import "../AddUser/AddUser.css";
import "../../components/TransactionPage/TransactionPage.css";
import "./Transfer.css";

export default function Transfer() {
  const [fromAccount, setFromAccount] = useState("");
  const [toAccount, setToAccount] = useState("");
  const [amount, setAmount] = useState("");
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [confirming, setConfirming] = useState(false);
  const [loading, setLoading] = useState(false);
  const [receipt, setReceipt] = useState(null);

  const from = fromAccount.trim();
  const to = toAccount.trim();

  const swap = () => {
    setFromAccount(toAccount);
    setToAccount(fromAccount);
  };

  // الخطوة 1: فحص سريع ثم نافذة التأكيد
  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors({});
    setMessage("");

    if (from === to) {
      setMessage("The source and destination accounts must be different");
      return;
    }
    setConfirming(true);
  };

  // الخطوة 2: الإرسال بعد التأكيد
  const handleConfirm = async () => {
    setLoading(true);
    try {
      const { data } = await api.post("/transactions/transfer", {
        fromAccount: from,
        toAccount: to,
        amount,
      });
      setReceipt(data);
    } catch (err) {
      const res = err.response;
      const code = res?.data?.error;

      if (!res) setMessage("Cannot connect to server");
      else if (res.status === 403) setMessage("You don't have permission");
      else if (res.status === 404) setMessage(res.data?.error || "Account not found");
      else if (res.status === 400 && (code === "INSUFFICIENT_BALANCE" || code === "SAME_ACCOUNT_TRANSFER"))
        setMessage(res.data.message);
      else if (res.status === 400) setErrors(res.data); // { field: message }
      else setMessage("Transfer failed");
    } finally {
      setLoading(false);
      setConfirming(false);
    }
  };

  const reset = () => {
    setReceipt(null);
    setFromAccount("");
    setToAccount("");
    setAmount("");
    setErrors({});
    setMessage("");
  };

  const header = (
    <div className="page-header">
      <div>
        <h2 className="page-title">Transfer</h2>
        <p className="page-sub">Move money from one account to another</p>
      </div>
    </div>
  );

  // ---------- إيصال النجاح ----------
  if (receipt) {
    return (
      <div>
        {header}

        <div className="card receipt">
          <div className="receipt-icon">
            <FaCheck />
          </div>
          <h3>Transfer successful</h3>
          <p className="receipt-sub">{receipt.message}</p>

          <div className="transfer-flow">
            <div className="transfer-side">
              <span>From</span>
              <strong>{receipt.fromAccount}</strong>
              <small>New balance</small>
              <b>{formatMoney(receipt.fromNewBalance)}</b>
            </div>

            <div className="transfer-middle">
              <FaArrowRight />
              <strong>{formatMoney(receipt.amount)}</strong>
            </div>

            <div className="transfer-side">
              <span>To</span>
              <strong>{receipt.toAccount}</strong>
              <small>New balance</small>
              <b>{formatMoney(receipt.toNewBalance)}</b>
            </div>
          </div>

          <button className="btn btn-primary" onClick={reset}>
            <FaExchangeAlt /> New transfer
          </button>
        </div>
      </div>
    );
  }

  // ---------- النموذج ----------
  return (
    <div>
      {header}

      <form className="add-user-form card" onSubmit={handleSubmit}>
        <div className="transfer-accounts">
          <div className="form-field">
            <label htmlFor="fromAccount">From account</label>
            <input
              id="fromAccount"
              className="input"
              value={fromAccount}
              onChange={(e) => setFromAccount(e.target.value)}
              autoComplete="off"
              required
            />
            {errors.fromAccount && <span className="error-text">{errors.fromAccount}</span>}
          </div>

          <button
            type="button"
            className="swap-btn"
            onClick={swap}
            aria-label="Swap accounts"
            title="Swap accounts"
          >
            <FaExchangeAlt />
          </button>

          <div className="form-field">
            <label htmlFor="toAccount">To account</label>
            <input
              id="toAccount"
              className="input"
              value={toAccount}
              onChange={(e) => setToAccount(e.target.value)}
              autoComplete="off"
              required
            />
            {errors.toAccount && <span className="error-text">{errors.toAccount}</span>}
          </div>
        </div>

        <div className="form-field">
          <label htmlFor="amount">Amount</label>
          <input
            id="amount"
            className="input amount-input"
            type="number"
            min="0.01"
            step="0.01"
            placeholder="0.00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
          {errors.amount && <span className="error-text">{errors.amount}</span>}
        </div>

        {message && <p className="alert-error">{message}</p>}

        <div className="form-actions">
          <button type="submit" className="btn btn-primary">
            Continue
          </button>
        </div>
      </form>

      {confirming && (
        <ConfirmModal
          variant="primary"
          title="Confirm transfer"
          message={`Transfer ${formatMoney(amount)} from account ${from} to account ${to}?`}
          confirmText="Yes, transfer"
          loadingText="Transferring..."
          loading={loading}
          onConfirm={handleConfirm}
          onCancel={() => setConfirming(false)}
        />
      )}
    </div>
  );
}
