import { Navigate } from "react-router-dom";
import { useAuth, type UserRole } from "@/context/AuthContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: UserRole;
}

export function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && user?.role !== requiredRole) {
    // Redirect to their appropriate dashboard if they don't have access
    return <Navigate to={user?.role === "admin" ? "/admin" : "/employee"} replace />;
  }

  return <>{children}</>;
}
