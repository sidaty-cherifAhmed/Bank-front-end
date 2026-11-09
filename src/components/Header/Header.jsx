import { useNavigate } from "react-router-dom";
import { FaSignOutAlt } from "react-icons/fa";
import { getUser } from "../../utils/permissions";
import "./Header.css";

export default function Header() {

  const navigate = useNavigate();
  const user = getUser();

  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <header className="header">
      <div className="header-user">
        <div className="header-avatar">
          {user?.firstname?.[0]}{user?.lastname?.[0]}
        </div>
        <div className="header-text">
          <span className="header-hello">Welcome back</span>
          <span className="header-name">{user?.firstname} {user?.lastname}</span>
        </div>
      </div>

      <button className="logout-btn" onClick={logout}>
        <FaSignOutAlt /> <span>Logout</span>
      </button>
    </header>
  );
}
