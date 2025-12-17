import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, UserRole, LoginCredentials, RegisterData, rolePermissions } from '@/types/auth';
import { authService } from '@/services/authService';
import { useNavigate } from 'react-router-dom'; // Necesario para redireccionar
import { toast } from 'sonner'; // O la librería de notificaciones que uses

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  hasPermission: (permission: string) => boolean;
  hasRole: (role: UserRole | UserRole[]) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate(); // Instancia para navegación

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    if (currentUser && authService.isAuthenticated()) {
      setUser(currentUser);
    }
    setIsLoading(false);
  }, []);

  const login = async (credentials: LoginCredentials) => {
  try {
    const response = await authService.login(credentials);
    
    // 1. Primero actualizamos el estado del usuario
    setUser(response.user);
    
    // 2. Usamos un pequeño truco: dejar que el ciclo de renderizado termine
    // antes de navegar, o simplemente confiar en que el componente Auth.tsx 
    // reaccionará al cambio de 'user'.
    
    const role = response.user.role;
    
    // IMPORTANTE: Asegúrate de que esto se ejecute tras el éxito de la promesa
    if (role === 'ADMINISTRATOR' || role === 'administrador') {
      navigate('/', { replace: true });
    } else if (role === 'MEDIC' || role === 'medico') {
      navigate('/mi-agenda', { replace: true });
    } else {
      navigate('/', { replace: true });
    }

    toast.success("Bienvenido al sistema");
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Error";
    toast.error(message);
    throw error;
  }
};

  const register = async (data: RegisterData) => {
    try {
      const response = await authService.register(data);
      setUser(response.user);
      toast.success("Registro exitoso");
      navigate('/dashboard');
    } catch (Error) {
      toast.error(Error.message || "Error en el registro");
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    navigate('/auth'); // Redirigir al login al cerrar sesión
  };

  const hasPermission = (permission: string): boolean => {
    if (!user) return false;
    const permissions = rolePermissions[user.role as UserRole] || [];
    return permissions.includes('all_permissions') || permissions.includes(permission);
  };

  const hasRole = (role: UserRole | UserRole[]): boolean => {
    if (!user) return false;
    if (Array.isArray(role)) {
      return role.includes(user.role as UserRole);
    }
    return user.role === role;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        hasPermission,
        hasRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}