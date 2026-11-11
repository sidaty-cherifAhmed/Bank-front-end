import { FaPhone, FaEnvelope, FaHashtag } from "react-icons/fa";
import { formatMoney, initials } from "../../utils/format";
import "../UserCard/UserCard.css";
import "./ClientCard.css";

// بطاقة عرض عميل. children = أزرار إضافية أسفل البطاقة
export default function ClientCard({ client, children }) {
  return (
    <div className="user-card card">
      <div className="user-card-top">
        <div className="user-avatar">{initials(client.clientName)}</div>
        <div>
          <h3>{client.clientName}</h3>
          <span className="user-badge">ID {client.id}</span>
        </div>
      </div>

      <div className="balance-box">
        <span>Balance</span>
        <strong>{formatMoney(client.balance)}</strong>
      </div>

      <div className="user-row">
        <FaHashtag />
        <span className="user-label">Account</span>
        <span className="user-value">{client.accountNumber}</span>
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
