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

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAuthenticated) {
    // Si no está logueado, mandar al login
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  // Si hay roles definidos y el usuario no tiene el rol necesario
  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    // Lógica de redirección inteligente:
    // Si es paciente o médico intentando entrar a una ruta prohibida (como Dashboard),
    // los mandamos a su "Mi Agenda".
    if (user.role === 'paciente' || user.role === 'medico') {
      return <Navigate to="/mi-agenda" replace />;
    }
    
    // Para otros casos (o admin), mandar al home por defecto
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}