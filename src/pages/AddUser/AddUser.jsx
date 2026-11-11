import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../service/api";
import PermissionsPicker from "../../components/PermissionsPicker/PermissionsPicker";
import "./AddUser.css";

const emptyForm = {
  userName: "",
  firstname: "",
  lastname: "",
  phone: "",
  password: "",
};

export default function AddUser() {
  const navigate = useNavigate();

  const [form, setForm] = useState(emptyForm);

  const [permissions, setPermissions] = useState(0);
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setMessage("");

    if (permissions === 0) {
      setErrors({ permissions: "Select at least one permission" });
      return;
    }

    setLoading(true);
    try {
      await api.post("/users", { ...form, permissions });
      navigate("/dashboard/users");
    } catch (err) {
      const res = err.response;
      if (!res) setMessage("Cannot connect to server");
      else if (res.status === 403) setMessage("You don't have permission");
      else if (res.status === 400) setErrors(res.data); // { field: message }
      else if (res.status === 409) setMessage(res.data.message);
      else setMessage("Failed to create user");
    } finally {
      setLoading(false);
    }
  };

  const textField = (name, label, type = "text") => (
    <div className="form-field">
      <label htmlFor={name}>{label}</label>
      <input
        className="input"
        id={name}
        name={name}
        type={type}
        value={form[name]}
        onChange={handleChange}
        required
      />
      {errors[name] && <span className="error-text">{errors[name]}</span>}
    </div>
  );

  return (
    <div>
      <div className="page-header">
        <div>
          <h2 className="page-title">Add New User</h2>
          <p className="page-sub">Create a staff account and choose what it can do</p>
        </div>
      </div>

      <form className="add-user-form card" onSubmit={handleSubmit}>
        <div className="form-grid">
          {textField("firstname", "First name")}
          {textField("lastname", "Last name")}
          {textField("userName", "Username")}
          {textField("phone", "Phone")}
          <div className="span-2">{textField("password", "Password", "password")}</div>
        </div>

        <PermissionsPicker
          value={permissions}
          onChange={setPermissions}
          error={errors.permissions || errors.permissionsValid}
        />

        {message && <p className="alert-error">{message}</p>}

        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? "Saving..." : "Create User"}
        </button>
      </form>
    </div>
  );
}
