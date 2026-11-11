import { useState } from "react";
import { FaTrash } from "react-icons/fa";
import api from "../../service/api";
import ClientSearch from "../../components/ClientSearch/ClientSearch";
import ClientCard from "../../components/ClientCard/ClientCard";
import ConfirmModal from "../../components/ConfirmModal/ConfirmModal";
import { formatMoney } from "../../utils/format";
import "../FindUser/FindUser.css";

export default function DeleteClient() {
  const [client, setClient] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [confirming, setConfirming] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleReset = () => {
    setClient(null);
    setError("");
    setSuccess("");
  };

  const handleDelete = async () => {
    setDeleting(true);
    setError("");

    try {
      await api.delete(`/clients/${client.id}`);
      setSuccess(`Client "${client.clientName}" (account ${client.accountNumber}) was deleted`);
      setClient(null);
    } catch (err) {
      const res = err.response;
      if (!res) setError("Cannot connect to server");
      else if (res.status === 403) setError("You don't have permission");
      else if (res.status === 404) setError("Client not found");
      else setError("Failed to delete client");
    } finally {
      setDeleting(false);
      setConfirming(false);
    }
  };

  const hasBalance = client && Number(client.balance) > 0;

  return (
    <div>
      <div className="page-header">
        <div>
          <h2 className="page-title">Delete Client</h2>
          <p className="page-sub">Find the client, then confirm the deletion</p>
        </div>
      </div>

      <ClientSearch onFound={setClient} onReset={handleReset} />

      {error && <p className="alert-error find-error">{error}</p>}
      {success && <p className="alert-success find-error">{success}</p>}

      {client && (
        <ClientCard client={client}>
          {hasBalance && (
            <p className="alert-error">
              This account still holds {formatMoney(client.balance)}.
            </p>
          )}
          <button className="btn btn-danger" onClick={() => setConfirming(true)}>
            <FaTrash /> Delete client
          </button>
        </ClientCard>
      )}

      {confirming && (
        <ConfirmModal
          title="Delete this client?"
          message={
            `${client.clientName} (account ${client.accountNumber}) will be permanently removed.` +
            (hasBalance ? ` The remaining balance of ${formatMoney(client.balance)} will be lost.` : "") +
            " This cannot be undone."
          }
          confirmText="Yes, delete"
          loading={deleting}
          onConfirm={handleDelete}
          onCancel={() => setConfirming(false)}
        />
      )}
    </div>
  );
}
