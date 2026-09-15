import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/useAuth";

function CustomerRoute() {
  const { customerToken, customerUser } = useAuth();
  const location = useLocation();

  if (!customerToken || !customerUser) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return <Outlet />;
}

export default CustomerRoute;
