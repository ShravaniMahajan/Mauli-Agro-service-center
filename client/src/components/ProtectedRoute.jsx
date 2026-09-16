import { Navigate } from "react-router-dom";

// Protects any route that requires login
export function PrivateRoute({ children }) {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" replace />;
}

// Protects admin-only routes
export function AdminRoute({ children }) {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  if (!token) return <Navigate to="/login" replace />;
  if (user.role !== "admin") return <Navigate to="/user-panel" replace />;
  return children;
}
