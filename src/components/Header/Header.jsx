import { useNavigate } from "react-router-dom";
import { FaBars, FaSignOutAlt } from "react-icons/fa";
import { getUser } from "../../utils/permissions";
import "./Header.css";

// onMenu: opens the drawer (phones) or folds/unfolds the menu (wide screens)
export default function Header({ onMenu, collapsed = false }) {

  const navigate = useNavigate();
  const user = getUser();

  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <header className="header">
      <div className="header-left">
        <button
          type="button"
          className="menu-btn"
          onClick={onMenu}
          aria-label={collapsed ? "Show menu" : "Hide menu"}
          title={collapsed ? "Show menu" : "Hide menu"}
        >
          <FaBars />
        </button>

        <div className="header-user">
          <span className="header-mono">
            {user?.firstname?.[0]}{user?.lastname?.[0]}
          </span>
          <span className="header-name">{user?.firstname} {user?.lastname}</span>
        </div>
      </div>

      <button className="logout-btn" onClick={logout} aria-label="Log out">
        <FaSignOutAlt />
        <span>Log out</span>
      </button>
    </header>
  );
}
