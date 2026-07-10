import { Navigate } from "react-router-dom";
import useAuth from "../hooks/useAuth.js";
import ProtectedRoute from "./ProtectedRoute.jsx";

export default function AdminRoute({ children }) {
  const { user } = useAuth();

  return (
    <ProtectedRoute>
      {user?.role === "admin" ? children : <Navigate replace to="/dashboard" />}
    </ProtectedRoute>
  );
}
