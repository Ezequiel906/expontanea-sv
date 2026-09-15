import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/useAuth";

function ProtectedRoute() {
  const { adminToken, adminUser } = useAuth();

  if (!adminToken || !adminUser) {
    return <Navigate to="/login" replace />;
  }

  if (adminUser.role !== "ADMIN") {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}

export default ProtectedRoute;
