import { useState } from "react";
import { FaEye, FaUser, FaPhone } from "react-icons/fa";
import PermissionsModal from "../PermissionsModal/PermissionsModal";
import "./UserCard.css";

// User card. children = extra buttons shown at the bottom of the card (e.g. the delete button)
export default function UserCard({ user, children }) {
  const [showPermissions, setShowPermissions] = useState(false);

  return (
    <div className="user-card card">
      <div className="user-card-top">
        <div className="user-avatar">
          {user.firstname[0]}{user.lastname[0]}
        </div>
        <div>
          <h3>{user.firstname} {user.lastname}</h3>
          <span className="user-badge">ID {user.id}</span>
        </div>
      </div>

      <div className="user-row">
        <FaUser />
        <span className="user-label">Username</span>
        <span className="user-value">{user.userName}</span>
      </div>

      <div className="user-row">
        <FaPhone />
        <span className="user-label">Phone</span>
        <span className="user-value">{user.phone}</span>
      </div>

      <div className="user-actions">
        <button className="perm-btn" onClick={() => setShowPermissions(true)}>
          <FaEye /> View permissions
        </button>
        {children}
      </div>

      {showPermissions && (
        <PermissionsModal
          user={user}
          onClose={() => setShowPermissions(false)}
        />
      )}
    </div>
  );
}
