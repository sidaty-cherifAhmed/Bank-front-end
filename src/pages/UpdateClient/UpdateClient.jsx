import { useState } from "react";
import api from "../../service/api";
import ClientSearch from "../../components/ClientSearch/ClientSearch";
import { formatMoney } from "../../utils/format";
import "../AddUser/AddUser.css";

export default function UpdateClient() {
  const [client, setClient] = useState(null); // the loaded client (read-only)
  const [form, setForm] = useState(null);      // the editable fields
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState("");
  const [saving, setSaving] = useState(false);

  const handleFound = (data) => {
    setClient(data);
    setForm({
      clientName: data.clientName,
      phone: data.phone,
      email: data.email,
      pinCode: "", // empty: the old PIN is kept
    });
  };

  const handleReset = () => {
    setClient(null);
    setForm(null);
    setErrors({});
    setMessage("");
    setSuccess("");
  };

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleDigits = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value.replace(/\D/g, "") });

  const handleSave = async (e) => {
    e.preventDefault();
    setErrors({});
    setMessage("");
    setSuccess("");

    // Do not send the PIN if it was left empty
    const body = { ...form };
    if (!body.pinCode) delete body.pinCode;

    setSaving(true);
    try {
      const { data } = await api.put(`/clients/${client.id}`, body);
      setClient(data);
      setForm({ ...form, pinCode: "" });
      setSuccess("Client updated successfully");
    } catch (err) {
      const res = err.response;
      if (!res) setMessage("Cannot connect to server");
      else if (res.status === 403) setMessage("You don't have permission");
      else if (res.status === 404) setMessage("Client not found");
      else if (res.status === 400) setErrors(res.data);
      else if (res.status === 409) setMessage(res.data.message);
      else setMessage("Failed to update client");
    } finally {
      setSaving(false);
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
          <h2 className="page-title">Update Client</h2>
          <p className="page-sub">Find the client, then edit their details</p>
        </div>
      </div>

      <ClientSearch onFound={handleFound} onReset={handleReset} />

      {form && (
        <form className="add-user-form card" onSubmit={handleSave}>
          <div className="form-grid">
            <div className="form-field">
              <label>Account number</label>
              <input className="input" value={client.accountNumber} disabled />
              <span className="field-hint">Cannot be changed</span>
            </div>

            <div className="form-field">
              <label>Balance</label>
              <input className="input" value={formatMoney(client.balance)} disabled />
              <span className="field-hint">Changes only through transactions</span>
            </div>

            <div className="span-2">
              {field("clientName", "Client name", { required: true })}
            </div>
            {field("phone", "Phone", {
              required: true,
              inputMode: "numeric",
              maxLength: 8,
              onChange: handleDigits,
            })}
            {field("email", "Email", { type: "email", required: true })}

            <div className="span-2">
              {field("pinCode", "New PIN code", {
                type: "password",
                inputMode: "numeric",
                maxLength: 4,
                placeholder: "4 digits",
                autoComplete: "new-password",
                onChange: handleDigits,
              })}
              <span className="field-hint">Leave empty to keep the current PIN</span>
            </div>
          </div>

          {message && <p className="alert-error">{message}</p>}
          {success && <p className="alert-success">{success}</p>}

          <div className="form-actions">
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? "Saving..." : "Save changes"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
