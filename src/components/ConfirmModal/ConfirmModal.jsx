import { FaExclamationTriangle } from "react-icons/fa";
import "../PermissionsModal/PermissionsModal.css";
import "./ConfirmModal.css";

export default function ConfirmModal({
  title,
  message,
  confirmText = "Confirm",
  loading = false,
  onConfirm,
  onCancel,
}) {
  return (
    <div className="modal-backdrop" onClick={loading ? undefined : onCancel}>
      <div className="modal-box confirm-box" onClick={(e) => e.stopPropagation()}>
        <div className="confirm-icon">
          <FaExclamationTriangle />
        </div>
        <h3>{title}</h3>
        <p>{message}</p>

        <div className="confirm-actions">
          <button className="btn btn-ghost" onClick={onCancel} disabled={loading}>
            Cancel
          </button>
          <button className="btn btn-danger" onClick={onConfirm} disabled={loading}>
            {loading ? "Deleting..." : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
