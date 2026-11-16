import { useState } from "react";
import { FaSearch } from "react-icons/fa";
import api from "../../service/api";
import PermissionsPicker from "../../components/PermissionsPicker/PermissionsPicker";
import "../FindUser/FindUser.css";
import "../AddUser/AddUser.css";

export default function UpdateUser() {
  // Step 1: search
  const [userId, setUserId] = useState("");
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState("");

  // Step 2: edit
  const [loadedId, setLoadedId] = useState(null);
  const [form, setForm] = useState(null);
  const [permissions, setPermissions] = useState(0);
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    setSearchError("");
    setSuccess("");
    setMessage("");
    setErrors({});
    setForm(null);
    setSearching(true);

    try {
      const { data } = await api.get(`/users/${userId}`);
      setLoadedId(data.id);
      setForm({
        userName: data.userName,
        firstname: data.firstname,
        lastname: data.lastname,
        phone: data.phone,
        password: "", // empty: the old password is kept
      });
      setPermissions(data.permissions);
    } catch (err) {
      const status = err.response?.status;
      if (!err.response) setSearchError("Cannot connect to server");
      else if (status === 404) setSearchError("User not found");
      else if (status === 403) setSearchError("You don't have permission");
      else setSearchError("Failed to find user");
    } finally {
      setSearching(false);
    }
  };

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSave = async (e) => {
    e.preventDefault();
    setErrors({});
    setMessage("");
    setSuccess("");

    if (permissions === 0) {
      setErrors({ permissions: "Select at least one permission" });
      return;
    }

    // Do not send the password if it was left empty
    const body = { ...form, permissions };
    if (!body.password) delete body.password;

    setSaving(true);
    try {
      await api.put(`/users/${loadedId}`, body);
      setSuccess("User updated successfully");
      setForm({ ...form, password: "" });
    } catch (err) {
      const res = err.response;
      if (!res) setMessage("Cannot connect to server");
      else if (res.status === 403) setMessage("You don't have permission");
      else if (res.status === 404) setMessage("User not found");
      else if (res.status === 400) setErrors(res.data);
      else if (res.status === 409) setMessage(res.data.message);
      else setMessage("Failed to update user");
    } finally {
      setSaving(false);
    }
  };

  const textField = (name, label, type = "text", required = true) => (
    <div className="form-field">
      <label htmlFor={name}>{label}</label>
      <input
        className="input"
        id={name}
        name={name}
        type={type}
        value={form[name]}
        onChange={handleChange}
        required={required}
        autoComplete={type === "password" ? "new-password" : "off"}
      />
      {errors[name] && <span className="error-text">{errors[name]}</span>}
    </div>
  );

  return (
    <div>
      <div className="page-header">
        <div>
          <h2 className="page-title">Update User</h2>
          <p className="page-sub">Find the user by ID, then edit their details</p>
        </div>
      </div>

      <form className="find-form" onSubmit={handleSearch}>
        <div className="find-input">
          <FaSearch />
          <input
            className="input"
            type="number"
            min="1"
            placeholder="Enter user ID"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary" disabled={searching}>
          {searching ? "Searching..." : "Search"}
        </button>
      </form>

      {searchError && <p className="alert-error find-error">{searchError}</p>}

      {form && (
        <form className="add-user-form card" onSubmit={handleSave}>
          <div className="form-grid">
            {textField("firstname", "First name")}
            {textField("lastname", "Last name")}
            {textField("userName", "Username")}
            {textField("phone", "Phone")}
            <div className="span-2">
              {textField("password", "New password", "password", false)}
              <span className="field-hint">Leave empty to keep the current password</span>
            </div>
          </div>

          <PermissionsPicker
            value={permissions}
            onChange={setPermissions}
            error={errors.permissions || errors.permissionsValid}
          />

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
