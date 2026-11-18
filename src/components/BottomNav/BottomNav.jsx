import { NavLink, useLocation } from "react-router-dom";
import { FaHome, FaUsers, FaExchangeAlt, FaCoins, FaEllipsisH } from "react-icons/fa";
import { Permissions, hasPermission } from "../../utils/permissions";
import "./BottomNav.css";

// The clients tab opens the first clients page the user is allowed to see
function clientsTarget() {
  if (hasPermission(Permissions.LIST_CLIENTS)) return "/dashboard/clients";
  if (hasPermission(Permissions.FIND_CLIENT)) return "/dashboard/clients/find";
  if (hasPermission(Permissions.ADD_NEW_CLIENT)) return "/dashboard/clients/add";
  return null;
}

// Phone navigation: four main places and "More" (opens the full menu)
export default function BottomNav({ onMore }) {
  const { pathname } = useLocation();
  const clients = clientsTarget();

  const tabs = [
    { to: "/dashboard", label: "Home", icon: <FaHome />, active: pathname === "/dashboard" },
    clients && {
      to: clients, label: "Clients", icon: <FaUsers />,
      active: pathname.startsWith("/dashboard/clients"),
    },
    hasPermission(Permissions.TRANSACTIONS) && {
      to: "/dashboard/transactions/deposit", label: "Money", icon: <FaExchangeAlt />,
      active: pathname.startsWith("/dashboard/transactions"),
    },
    {
      to: "/dashboard/currency", label: "Rates", icon: <FaCoins />,
      active: pathname.startsWith("/dashboard/currency"),
    },
  ].filter(Boolean);

  return (
    <nav className="bottom-nav" aria-label="Main">
      {tabs.map((t) => (
        <NavLink
          key={t.label}
          to={t.to}
          className={t.active ? "tab active" : "tab"}
          aria-current={t.active ? "page" : undefined}
        >
          <span className="tab-icon">{t.icon}</span>
          <span className="tab-label">{t.label}</span>
        </NavLink>
      ))}

      <button type="button" className="tab" onClick={onMore}>
        <span className="tab-icon"><FaEllipsisH /></span>
        <span className="tab-label">More</span>
      </button>
    </nav>
  );
}
