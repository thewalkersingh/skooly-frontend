import { Outlet, Navigate } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";

export default function SuperAdminRoute() {
  const user = useAuthStore((s) => s.user);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (user?.role !== "SUPER_ADMIN" && user?.role !== "ADMIN") {
    return <Navigate to="/dashboard" replace />;
  }
  return <Outlet />;
}