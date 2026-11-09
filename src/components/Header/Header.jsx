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
      <span>
        Welcome, <b>{user?.firstname} {user?.lastname}</b>
      </span>

      <button className="logout-btn" onClick={logout}>
        <FaSignOutAlt /> Logout
      </button>
    </header>
  );
}