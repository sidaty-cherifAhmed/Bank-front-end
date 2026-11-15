import { Link } from "react-router-dom";
import {
  FaList, FaUserPlus, FaSearch, FaExchangeAlt, FaUsers, FaCoins,
} from "react-icons/fa";
import { Permissions, getUser, hasPermission } from "../../utils/permissions";
import "./Dashboard.css";

const shortcuts = [
  { path: "/dashboard/clients",      label: "Client List",   text: "Browse all clients",        icon: <FaList />,         permission: Permissions.LIST_CLIENTS },
  { path: "/dashboard/clients/add",  label: "New Client",    text: "Register a new client",     icon: <FaUserPlus />,     permission: Permissions.ADD_NEW_CLIENT },
  { path: "/dashboard/transactions/deposit", label: "Deposit", text: "Add money to an account", icon: <FaExchangeAlt />, permission: Permissions.TRANSACTIONS },
  { path: "/dashboard/transactions/withdraw", label: "Withdraw", text: "Take money from an account", icon: <FaExchangeAlt />, permission: Permissions.TRANSACTIONS },
  { path: "/dashboard/transactions/transfer", label: "Transfer", text: "Move money between accounts", icon: <FaExchangeAlt />, permission: Permissions.TRANSACTIONS },
  { path: "/dashboard/users",        label: "Manage Users",  text: "View and manage staff",     icon: <FaUsers />,        permission: Permissions.MANAGE_USERS },
  { path: "/dashboard/users/add",    label: "New User",      text: "Create a staff account",    icon: <FaUserPlus />,     permission: Permissions.MANAGE_USERS },
  { path: "/dashboard/users/find",   label: "Find User",     text: "Search a user by ID",       icon: <FaSearch />,       permission: Permissions.MANAGE_USERS },
  { path: "/dashboard/currency",     label: "Currency",      text: "Exchange rates",            icon: <FaCoins /> },
];

export default function Dashboard() {
  const user = getUser();
  const visible = shortcuts.filter((s) => !s.permission || hasPermission(s.permission));

  return (
    <div>
      <section className="hero">
        <div>
          <p className="hero-hello">Welcome back</p>
          <h1>{user?.firstname} {user?.lastname}</h1>
        </div>
      </section>

      <h2 className="section-title">Quick access</h2>

      <div className="shortcut-grid">
        {visible.map((s, i) => (
          <Link
            key={s.path}
            to={s.path}
            className="shortcut card"
            style={{ animationDelay: `${i * 60}ms` }}
          >
            <span className="shortcut-icon">{s.icon}</span>
            <div>
              <h3>{s.label}</h3>
              <p>{s.text}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
