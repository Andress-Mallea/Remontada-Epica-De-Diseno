import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { UserRole } from "@/types/auth";
import { Loader2 } from "lucide-react";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}
export default function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { user, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) return <div>Cargando...</div>;

  if (!isAuthenticated || !user) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  // NORMALIZAR ROLES: Convertimos todo a mayúsculas para comparar
  const userRole = user.role.toUpperCase();
  const rolesPermitidos = allowedRoles?.map(r => r.toUpperCase());

  if (rolesPermitidos && !rolesPermitidos.includes(userRole)) {
    // Si no tiene permiso, NO lo mandes a "/" (porque causa bucle)
    // Mándalo a una página donde todos tengan permiso
    return <Navigate to="/mi-agenda" replace />; 
  }

  return <>{children}</>;
}