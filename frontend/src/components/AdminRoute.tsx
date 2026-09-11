import {
  Navigate,
  Outlet,
} from "react-router-dom";

import { useAuth } from "../context/AuthContext";

const AdminRoute = () => {
  const { user } = useAuth();

  // User is not logged in
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // User is logged in but is not an admin
  if (user.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  // User is an admin
  return <Outlet />;
};

export default AdminRoute;