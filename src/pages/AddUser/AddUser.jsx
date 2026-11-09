import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../service/api";
import { Permissions } from "../../utils/permissions";
import "./AddUser.css";

const permissionList = Object.entries(Permissions).filter(([, v]) => v > 0);

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

  const isAll = permissions === Permissions.ALL;

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const togglePermission = (value) => {
    setPermissions((prev) => (prev & value ? prev & ~value : prev | value));
  };

  const toggleAll = () => setPermissions(isAll ? 0 : Permissions.ALL);

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
      <h2>Add New User</h2>

      <form className="add-user-form" onSubmit={handleSubmit}>
        {textField("userName", "Username")}
        {textField("firstname", "First name")}
        {textField("lastname", "Last name")}
        {textField("phone", "Phone")}
        {textField("password", "Password", "password")}

        <fieldset className="permissions-box">
          <legend>
            Permissions <small>(value: {permissions})</small>
          </legend>

          <label className="perm-item">
            <input type="checkbox" checked={isAll} onChange={toggleAll} />
            ALL
          </label>

          {permissionList.map(([name, value]) => (
            <label key={name} className="perm-item">
              <input
                type="checkbox"
                disabled={isAll}
                checked={isAll || (permissions & value) === value}
                onChange={() => togglePermission(value)}
              />
              {name}
            </label>
          ))}

          {(errors.permissions || errors.permissionsValid) && (
            <span className="error-text">
              {errors.permissions || errors.permissionsValid}
            </span>
          )}
        </fieldset>

        {message && <p className="error-text">{message}</p>}

        <button type="submit" disabled={loading}>
          {loading ? "Saving..." : "Create User"}
        </button>
      </form>
    </div>
  );
}
