import {
  FaHome, FaList, FaUserPlus, FaTrash, FaEdit, FaSearch,
  FaExchangeAlt, FaUsers, FaUserMinus, FaUserEdit,
  FaClipboardList, FaCoins, FaChevronDown, FaChevronRight, FaUniversity, FaPlusCircle, FaMinusCircle, FaHistory, FaCalculator, FaListAlt
} from "react-icons/fa";
import { NavLink,useLocation } from "react-router-dom";
import { useState } from "react";
import { Permissions, hasPermission } from "../../utils/permissions";
import "./Sidebar.css";





const menu = [
  { path: "/dashboard",                label: "Home",               icon: <FaHome /> },
  { path: "/dashboard/clients",        label: "Show Client List",   icon: <FaList />,        permission: Permissions.LIST_CLIENTS },
  { path: "/dashboard/clients/add",    label: "Add New Client",     icon: <FaUserPlus />,    permission: Permissions.ADD_NEW_CLIENT },
  { path: "/dashboard/clients/delete", label: "Delete Client",      icon: <FaTrash />,       permission: Permissions.DELETE_CLIENT },
  { path: "/dashboard/clients/update", label: "Update Client Info", icon: <FaEdit />,        permission: Permissions.UPDATE_CLIENTS },
  { path: "/dashboard/clients/find",   label: "Find Client",        icon: <FaSearch />,      permission: Permissions.FIND_CLIENT },
  {
    label: "Transactions",
    icon: <FaExchangeAlt />,
    permission: Permissions.TRANSACTIONS,
    basePath: "/dashboard/transactions",
    children: [
      { path: "/dashboard/transactions/deposit", label: "Deposit", icon: <FaPlusCircle /> },
      { path: "/dashboard/transactions/withdraw", label: "Withdraw", icon: <FaMinusCircle /> },
      { path: "/dashboard/transactions/transfer", label: "Transfer", icon: <FaExchangeAlt /> },
      { path: "/dashboard/transactions/log", label: "Deposit & Withdraw Log", icon: <FaListAlt /> },
      { path: "/dashboard/transactions/transfer-log", label: "Transfer Log", icon: <FaHistory /> },
    ],
  },
  {
    label: "Manage Users",
    icon: <FaUsers />,
    permission: Permissions.MANAGE_USERS,
    basePath: "/dashboard/users",
    children: [
      { path: "/dashboard/users",        label: "List Users",   icon: <FaList /> },
      { path: "/dashboard/users/add",    label: "Add New User", icon: <FaUserPlus /> },
      { path: "/dashboard/users/delete", label: "Delete User",  icon: <FaUserMinus /> },
      { path: "/dashboard/users/update", label: "Update User",  icon: <FaUserEdit /> },
      { path: "/dashboard/users/find",   label: "Find User",    icon: <FaSearch /> },
    ],
  },
  { path: "/dashboard/login-register", label: "Login Register",    icon: <FaClipboardList />, permission: Permissions.LOGIN_REGISTER_SCREEN },
  {
    label: "Currency Exchange",
    icon: <FaCoins />,
    basePath: "/dashboard/currency",
    children: [
      { path: "/dashboard/currency", label: "Currency List", icon: <FaList /> },
      { path: "/dashboard/currency/find", label: "Find Currency", icon: <FaSearch /> },
      { path: "/dashboard/currency/calculator", label: "Calculator", icon: <FaCalculator /> },
      { path: "/dashboard/currency/update", label: "Update Rate", icon: <FaEdit />, permission: Permissions.TRANSACTIONS },
    ],
  },
];


export default function Sidebar()
{
    const location = useLocation();

    const [openMenu, setOpenMenu] = useState(
    () => menu.find((i) => i.children && location.pathname.startsWith(i.basePath))?.label ?? null
  );

    const toggle = (label) => setOpenMenu(openMenu === label ? null : label);

  const visibleMenu = menu.filter(
    (item) => !item.permission || hasPermission(item.permission)
  );


    return (
    <aside className="sidebar">

      <div className="sidebar-logo">
        <FaUniversity size={26} />
        <span>Bank System</span>
      </div>

      <nav>
        {visibleMenu.map((item) =>
          item.children ? (
            // Item with a submenu
            <div key={item.label}>
              <button
                className={
                  location.pathname.startsWith(item.basePath)
                    ? "sidebar-link sidebar-parent active-parent"
                    : "sidebar-link sidebar-parent"
                }
                onClick={() => toggle(item.label)}
              >

                {item.icon}
                <span>{item.label}</span>
                <span className="sidebar-arrow">
                  {openMenu === item.label ? <FaChevronDown /> : <FaChevronRight />}
                </span>
              </button>

              {openMenu === item.label && (
                <div className="submenu">
                  {item.children
                    .filter((child) => !child.permission || hasPermission(child.permission))
                    .map((child) => (
                    <NavLink
                      key={child.path}
                      to={child.path}
                      end
                      className={({ isActive }) => (isActive ? "sidebar-link active" : "sidebar-link")}
                    >
                      {child.icon}
                      <span>{child.label}</span>
                    </NavLink>
                  ))}
                </div>
              )}
            </div>
          ) : (
            // Regular item
            <NavLink
              key={item.path}
              to={item.path}
              end
              className={({ isActive }) => (isActive ? "sidebar-link active" : "sidebar-link")}
            >
              {item.icon}
              <span>{item.label}</span>
            </NavLink>
          )
        )}
       
      </nav>
    </aside>
  );
}





