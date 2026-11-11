import { Permissions } from "../../utils/permissions";
import "./PermissionsPicker.css";

const permissionList = Object.entries(Permissions).filter(([, v]) => v > 0);

export default function PermissionsPicker({ value, onChange, error }) {
  const isAll = value === Permissions.ALL;

  const toggle = (bit) => onChange(value & bit ? value & ~bit : value | bit);
  const toggleAll = () => onChange(isAll ? 0 : Permissions.ALL);

  return (
    <fieldset className="permissions-box">
      <legend>
        Permissions <span className="perm-value">{value}</span>
      </legend>

      <div className="perm-grid">
        <label className="perm-item perm-all">
          <input type="checkbox" checked={isAll} onChange={toggleAll} />
          ALL
        </label>

        {permissionList.map(([name, bit]) => (
          <label key={name} className="perm-item">
            <input
              type="checkbox"
              disabled={isAll}
              checked={isAll || (value & bit) === bit}
              onChange={() => toggle(bit)}
            />
            {name}
          </label>
        ))}
      </div>

      {error && <span className="error-text">{error}</span>}
    </fieldset>
  );
}
