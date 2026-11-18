import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FaArrowRight, FaArrowDown, FaArrowUp, FaPlus, FaMinus, FaExchangeAlt, FaCoins,
  FaList, FaUserPlus, FaSearch, FaUsers, FaClipboardList,
} from "react-icons/fa";
import api from "../../service/api";
import CountUp from "../../components/CountUp/CountUp";
import { Permissions, getUser, hasPermission } from "../../utils/permissions";
import { formatMoney, timeAgo } from "../../utils/format";
import "./Dashboard.css";

// The four round buttons under the balance
const actions = [
  { path: "/dashboard/transactions/deposit", label: "Deposit", icon: <FaPlus />, permission: Permissions.TRANSACTIONS },
  { path: "/dashboard/transactions/withdraw", label: "Withdraw", icon: <FaMinus />, permission: Permissions.TRANSACTIONS },
  { path: "/dashboard/transactions/transfer", label: "Transfer", icon: <FaExchangeAlt />, permission: Permissions.TRANSACTIONS },
  { path: "/dashboard/currency/calculator", label: "Exchange", icon: <FaCoins /> },
];

// Grouped lists
const sections = [
  {
    title: "Clients",
    items: [
      { path: "/dashboard/clients", label: "Client list", text: "Browse every client", icon: <FaList />, permission: Permissions.LIST_CLIENTS },
      { path: "/dashboard/clients/add", label: "New client", text: "Open an account", icon: <FaUserPlus />, permission: Permissions.ADD_NEW_CLIENT },
      { path: "/dashboard/clients/find", label: "Find a client", text: "By ID or account number", icon: <FaSearch />, permission: Permissions.FIND_CLIENT },
    ],
  },
  {
    title: "Staff",
    items: [
      { path: "/dashboard/users", label: "Users", text: "View and manage staff", icon: <FaUsers />, permission: Permissions.MANAGE_USERS },
      { path: "/dashboard/users/add", label: "New user", text: "Create a staff account", icon: <FaUserPlus />, permission: Permissions.MANAGE_USERS },
      { path: "/dashboard/login-register", label: "Login register", text: "Who signed in, and when", icon: <FaClipboardList />, permission: Permissions.LOGIN_REGISTER_SCREEN },
    ],
  },
];

function greeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

export default function Dashboard() {
  const user = getUser();
  const canList = hasPermission(Permissions.LIST_CLIENTS);
  const canTransact = hasPermission(Permissions.TRANSACTIONS);

  // null = still loading, false = not available (no permission or the request failed)
  const [stats, setStats] = useState(canList ? null : false);
  const [recent, setRecent] = useState(canTransact ? null : false);

  useEffect(() => {
    let cancelled = false; // ignore answers that arrive after leaving the page

    if (canList) {
      api.get("/clients")
        .then((res) => {
          if (cancelled) return;
          setStats({
            count: res.data.length,
            balance: res.data.reduce((sum, c) => sum + Number(c.balance), 0),
          });
        })
        .catch(() => !cancelled && setStats(false));
    }

    if (canTransact) {
      api.get("/transactions/log", { params: { page: 0, size: 5 } })
        .then((res) => !cancelled && setRecent(res.data.content))
        .catch(() => !cancelled && setRecent(false));
    }

    return () => {
      cancelled = true;
    };
  }, [canList, canTransact]);

  const today = new Date().toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  const visibleActions = actions.filter((a) => !a.permission || hasPermission(a.permission));

  // Hide the items the user cannot open, then hide groups left empty
  const visible = sections
    .map((s) => ({
      ...s,
      items: s.items.filter((i) => !i.permission || hasPermission(i.permission)),
    }))
    .filter((s) => s.items.length > 0);

  return (
    <div>
      <header className="home-top">
        <p className="home-date">{today}</p>
        <h1>{greeting()}, {user?.firstname}</h1>
      </header>

      {/* ---------- the big balance ---------- */}
      {stats !== false && (
        <section className="balance-hero">
          <span className="balance-label">Total balance</span>
          {stats === null ? (
            <span className="skeleton balance-skeleton" />
          ) : (
            <>
              <strong className="balance-figure">
                <CountUp value={stats.balance} format={formatMoney} />
              </strong>
              <span className="balance-sub">
                Across <b><CountUp value={stats.count} /></b> {stats.count === 1 ? "client" : "clients"}
              </span>
            </>
          )}
        </section>
      )}

      {/* ---------- round action buttons ---------- */}
      <div className="quick-actions">
        {visibleActions.map((a) => (
          <Link key={a.path} to={a.path} className="qa">
            <span className="qa-circle">{a.icon}</span>
            <span className="qa-label">{a.label}</span>
          </Link>
        ))}
      </div>

      {/* ---------- latest operations ---------- */}
      {recent !== false && (
        <section className="home-section">
          <div className="section-head">
            <h2>Latest operations</h2>
            <Link to="/dashboard/transactions/log" className="section-link">See all</Link>
          </div>

          {recent === null ? (
            <div className="group group-skeleton">
              <span className="skeleton" />
              <span className="skeleton" />
              <span className="skeleton" />
            </div>
          ) : recent.length === 0 ? (
            <p className="group-empty">No deposits or withdrawals yet.</p>
          ) : (
            <ul className="group">
              {recent.map((r) => {
                const deposit = r.type === "DEPOSIT";
                return (
                  <li key={r.id} className="row activity">
                    <span className={deposit ? "row-icon in" : "row-icon out"}>
                      {deposit ? <FaArrowDown /> : <FaArrowUp />}
                    </span>
                    <span className="row-text">
                      <strong>{deposit ? "Deposit" : "Withdrawal"}</strong>
                      <small>{r.accountNumber} · {timeAgo(r.dateTime)}</small>
                    </span>
                    <span className={deposit ? "row-amount in" : "row-amount out"}>
                      {deposit ? "+" : "−"} {formatMoney(r.amount)}
                    </span>
                  </li>
                );
              })}
            </ul>
          )}
        </section>
      )}

      {/* ---------- shortcuts ---------- */}
      {visible.map((section) => (
        <section key={section.title} className="home-section">
          <div className="section-head">
            <h2>{section.title}</h2>
          </div>

          <ul className="group">
            {section.items.map((item) => (
              <li key={item.path}>
                <Link to={item.path} className="row link">
                  <span className="row-icon plain">{item.icon}</span>
                  <span className="row-text">
                    <strong>{item.label}</strong>
                    <small>{item.text}</small>
                  </span>
                  <FaArrowRight className="row-arrow" />
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
