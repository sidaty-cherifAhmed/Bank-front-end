
import { Navigate } from "react-router-dom";
import { hasPermission } from "../../utils/permissions";


export default function ProtectedRoute({ children, permission }) {

  const token = localStorage.getItem("token");

  if (!token) return <Navigate to="/login" replace />;

  if (permission && !hasPermission(permission)) {
     return <h3 className="access-denied"> Access Denied! Contact your Admin.</h3>;
  }


  return children;
}