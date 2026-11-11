import { useState } from "react";
import api from "../../service/api";
import "../AddUser/AddUser.css";

const emptyForm = {
  accountNumber: "",
  pinCode: "",
  clientName: "",
  phone: "",
  email: "",
  balance: "",
};

export default function AddClient() {
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  // حقول أرقام فقط (الرمز السري والهاتف): نحذف أي حرف غير رقم
  const handleDigits = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value.replace(/\D/g, "") });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setMessage("");
    setSuccess("");
    setLoading(true);

    try {
      const { data } = await api.post("/clients", form);
      setSuccess(`Client "${data.clientName}" was added (account ${data.accountNumber})`);
      setForm(emptyForm);
    } catch (err) {
      const res = err.response;
      if (!res) setMessage("Cannot connect to server");
      else if (res.status === 403) setMessage("You don't have permission");
      else if (res.status === 400) setErrors(res.data); // { field: message }
      else if (res.status === 409) setMessage(res.data.message);
      else setMessage("Failed to add client");
    } finally {
      setLoading(false);
    }
  };

  const field = (name, label, props = {}) => (
    <div className="form-field">
      <label htmlFor={name}>{label}</label>
      <input
        className="input"
        id={name}
        name={name}
        value={form[name]}
        onChange={handleChange}
        required
        autoComplete="off"
        {...props}
      />
      {errors[name] && <span className="error-text">{errors[name]}</span>}
    </div>
  );

  return (
    <div>
      <div className="page-header">
        <div>
          <h2 className="page-title">Add New Client</h2>
          <p className="page-sub">Open a new bank account for a client</p>
        </div>
      </div>

      <form className="add-user-form card" onSubmit={handleSubmit}>
        <div className="form-grid">
          <div className="span-2">{field("clientName", "Client name")}</div>
          {field("accountNumber", "Account number")}
          {field("pinCode", "PIN code", {
            type: "password",
            inputMode: "numeric",
            maxLength: 4,
            placeholder: "4 digits",
            autoComplete: "new-password",
            onChange: handleDigits,
          })}
          {field("phone", "Phone", {
            inputMode: "numeric",
            maxLength: 8,
            placeholder: "8 digits",
            onChange: handleDigits,
          })}
          {field("email", "Email", { type: "email" })}
          <div className="span-2">
            {field("balance", "Opening balance", {
              type: "number",
              min: "0",
              step: "0.01",
              placeholder: "0.00",
            })}
          </div>
        </div>

        {message && <p className="alert-error">{message}</p>}
        {success && <p className="alert-success">{success}</p>}

        <div className="form-actions">
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? "Saving..." : "Add Client"}
          </button>
        </div>
      </form>
    </div>
  );
}
