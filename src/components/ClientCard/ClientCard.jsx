import { FaPhone, FaEnvelope, FaHashtag } from "react-icons/fa";
import CountUp from "../CountUp/CountUp";
import { formatMoney, initials } from "../../utils/format";
import "../UserCard/UserCard.css";
import "./ClientCard.css";

// "12345678" -> "1234 5678": easier to read and to copy
function spaced(accountNumber) {
  return String(accountNumber).replace(/(.{4})/g, "$1 ").trim();
}

// A client: name, a big balance, then the details. children = extra buttons at the bottom
export default function ClientCard({ client, children }) {
  return (
    <div className="user-card card client-card">
      <div className="user-card-top">
        <div className="user-avatar">{initials(client.clientName)}</div>
        <div>
          <h3>{client.clientName}</h3>
          <span className="user-badge">ID {client.id}</span>
        </div>
      </div>

      <div className="balance-line">
        <span>Balance</span>
        <strong>
          <CountUp value={Number(client.balance)} format={formatMoney} />
        </strong>
      </div>

      <div className="user-row">
        <FaHashtag />
        <span className="user-label">Account</span>
        <span className="user-value">{spaced(client.accountNumber)}</span>
      </div>

      <div className="user-row">
        <FaPhone />
        <span className="user-label">Phone</span>
        <span className="user-value">{client.phone}</span>
      </div>

      <div className="user-row">
        <FaEnvelope />
        <span className="user-label">Email</span>
        <span className="user-value">{client.email}</span>
      </div>

      {children && <div className="user-actions">{children}</div>}
    </div>
  );
}
