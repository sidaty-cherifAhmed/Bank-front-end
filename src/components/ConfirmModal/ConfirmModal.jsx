import { FaExclamationTriangle, FaQuestion } from "react-icons/fa";
import "../PermissionsModal/PermissionsModal.css";
import "./ConfirmModal.css";

// variant: "danger" (red, for deletions) or "primary" (blue, for regular confirmations)
export default function ConfirmModal({
  title,
  message,
  confirmText = "Confirm",
  loadingText = "Please wait...",
  variant = "danger",
  loading = false,
  onConfirm,
  onCancel,
}) {
  const isDanger = variant === "danger";

  return (
    <div className="modal-backdrop" onClick={loading ? undefined : onCancel}>
      <div className="modal-box confirm-box" onClick={(e) => e.stopPropagation()}>
        <div className={isDanger ? "confirm-icon" : "confirm-icon primary"}>
          {isDanger ? <FaExclamationTriangle /> : <FaQuestion />}
        </div>
        <h3>{title}</h3>
        <p>{message}</p>

        <div className="confirm-actions">
          <button className="btn btn-ghost" onClick={onCancel} disabled={loading}>
            Cancel
          </button>
          <button
            className={isDanger ? "btn btn-danger" : "btn btn-primary"}
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? loadingText : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
