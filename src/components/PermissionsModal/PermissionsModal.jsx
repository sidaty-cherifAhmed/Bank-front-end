import { FaCheck, FaTimes } from "react-icons/fa";
import { Permissions, maskHas } from "../../utils/permissions";
import "./PermissionsModal.css";

const permissionList = Object.entries(Permissions).filter(([, v]) => v > 0);

export default function PermissionsModal({ user, onClose }) {
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Permissions: {user.userName}</h3>
          <button className="modal-close" onClick={onClose} aria-label="Close">
            <FaTimes />
          </button>
        </div>

        <ul className="modal-list">
          {permissionList.map(([name, value]) => {
            const granted = maskHas(user.permissions, value);
            return (
              <li key={name}>
                <span>{name}</span>
                {granted && <FaCheck className="perm-check" />}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
