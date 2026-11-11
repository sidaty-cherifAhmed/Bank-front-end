import { useState } from "react";
import { FaCheck, FaPlus } from "react-icons/fa";
import api from "../../service/api";
import ConfirmModal from "../../components/ConfirmModal/ConfirmModal";
import { formatMoney } from "../../utils/format";
import "../AddUser/AddUser.css";
import "./Deposit.css";

export default function Deposit() {
  const [accountNumber, setAccountNumber] = useState("");
  const [amount, setAmount] = useState("");
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [confirming, setConfirming] = useState(false);
  const [loading, setLoading] = useState(false);
  const [receipt, setReceipt] = useState(null); // نتيجة العملية الناجحة

  // الخطوة 1: التحقق السريع ثم نافذة التأكيد
  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors({});
    setMessage("");
    setConfirming(true);
  };

  // الخطوة 2: الإرسال بعد التأكيد
  const handleConfirm = async () => {
    setLoading(true);
    try {
      const { data } = await api.post("/transactions/deposit", {
        accountNumber: accountNumber.trim(),
        amount,
      });
      setReceipt(data);
    } catch (err) {
      const res = err.response;
      if (!res) setMessage("Cannot connect to server");
      else if (res.status === 403) setMessage("You don't have permission");
      else if (res.status === 404) setMessage("Account not found");
      else if (res.status === 400) setErrors(res.data); // { field: message }
      else setMessage("Deposit failed");
    } finally {
      setLoading(false);
      setConfirming(false);
    }
  };

  const reset = () => {
    setReceipt(null);
    setAccountNumber("");
    setAmount("");
    setErrors({});
    setMessage("");
  };

  // ---------- إيصال النجاح ----------
  if (receipt) {
    return (
      <div>
        <div className="page-header">
          <div>
            <h2 className="page-title">Deposit</h2>
            <p className="page-sub">Add money to a client account</p>
          </div>
        </div>

        <div className="card receipt">
          <div className="receipt-icon">
            <FaCheck />
          </div>
          <h3>Deposit successful</h3>
          <p className="receipt-sub">{receipt.message}</p>

          <div className="receipt-rows">
            <div>
              <span>Account</span>
              <strong>{receipt.accountNumber}</strong>
            </div>
            <div>
              <span>Amount deposited</span>
              <strong className="receipt-plus">+ {formatMoney(receipt.amount)}</strong>
            </div>
            <div className="receipt-total">
              <span>New balance</span>
              <strong>{formatMoney(receipt.newBalance)}</strong>
            </div>
          </div>

          <button className="btn btn-primary" onClick={reset}>
            <FaPlus /> New deposit
          </button>
        </div>
      </div>
    );
  }

  // ---------- النموذج ----------
  return (
    <div>
      <div className="page-header">
        <div>
          <h2 className="page-title">Deposit</h2>
          <p className="page-sub">Add money to a client account</p>
        </div>
      </div>

      <form className="add-user-form card" onSubmit={handleSubmit}>
        <div className="form-field">
          <label htmlFor="accountNumber">Account number</label>
          <input
            id="accountNumber"
            className="input"
            value={accountNumber}
            onChange={(e) => setAccountNumber(e.target.value)}
            autoComplete="off"
            required
          />
          {errors.accountNumber && (
            <span className="error-text">{errors.accountNumber}</span>
          )}
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
          title="Confirm deposit"
          message={`Deposit ${formatMoney(amount)} into account ${accountNumber.trim()}?`}
          confirmText="Yes, deposit"
          loadingText="Depositing..."
          loading={loading}
          onConfirm={handleConfirm}
          onCancel={() => setConfirming(false)}
        />
      )}
    </div>
  );
}
