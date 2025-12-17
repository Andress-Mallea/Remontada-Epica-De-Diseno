import { cn } from "@/lib/utils";
import { NavLink } from "@/components/NavLink";
import { useAuth } from "@/context/AuthContext";
import { roleLabels } from "@/types/auth";
import {
  Calendar,
  Users,
  Stethoscope,
  ClipboardList,
  LayoutDashboard,
  LogOut,
  UserCog,
  FileText,
  History // 1. Importar icono History
} from "lucide-react";
import { Button } from "@/components/ui/button";

export function Sidebar() {
  const { user, logout, hasRole } = useAuth();

  const getNavigation = () => {
    const baseNav = [];

    // Dashboard
    if (hasRole(['ADMINISTRATOR', 'RECEPTIONIST'])) {
      baseNav.push({ name: "Dashboard", href: "/", icon: LayoutDashboard });
    }

    // Agenda
    if (hasRole(['ADMINISTRATOR', 'RECEPTIONIST', 'MEDIC', 'PATIENT'])) {
      baseNav.push({ name: "Agenda", href: "/agenda", icon: Calendar });
    }

    // Citas (Gestión activa)
    if (hasRole(['ADMINISTRATOR', 'RECEPTIONIST'])) {
      baseNav.push({ name: "Citas", href: "/citas", icon: ClipboardList });
    }

    // 2. NUEVA PESTAÑA: Historial de Citas
    if (hasRole(['ADMINISTRATOR', 'RECEPTIONIST'])) {
      baseNav.push({ name: "Historial", href: "/historial", icon: History });
    }

    // Mi Agenda
    if (hasRole(['MEDIC', 'PATIENT'])) {
      baseNav.push({ name: "Mi Agenda", href: "/mi-agenda", icon: FileText });
    }

    // Médicos
    if (hasRole(['ADMINISTRATOR', 'RECEPTIONIST'])) {
      baseNav.push({ name: "Médicos", href: "/medicos", icon: Stethoscope });
    }

    // Pacientes
    if (hasRole(['ADMINISTRATOR', 'RECEPTIONIST'])) {
      baseNav.push({ name: "Pacientes", href: "/pacientes", icon: Users });
    }

    // Usuarios
    if (hasRole('ADMINISTRATOR')) {
      baseNav.push({ name: "Usuarios", href: "/usuarios", icon: UserCog });
    }

    return baseNav;
  };

  const navigation = getNavigation();

  const handleLogout = () => {
    logout();
  };

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 bg-sidebar border-r border-sidebar-border">
      <div className="flex h-full flex-col">
        <div className="flex h-16 items-center gap-3 border-b border-sidebar-border px-6">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg gradient-primary">
            <Stethoscope className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-sidebar-foreground">ClínicaCare</h1>
            <p className="text-xs text-muted-foreground">Sistema de Gestión</p>
          </div>
        </div>

        <nav className="flex-1 space-y-1 px-3 py-4">
          {navigation.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-sidebar-foreground transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              activeClassName="bg-sidebar-accent text-sidebar-primary"
            >
              <item.icon className="h-5 w-5" />
              {item.name}
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-sidebar-border p-4 space-y-3">
          <div className="flex items-center gap-3 rounded-lg bg-sidebar-accent/50 px-3 py-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-semibold">
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-sidebar-foreground truncate">
                {user?.name || 'Usuario'}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {user?.role ? roleLabels[user.role] : 'Sin rol'}
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start gap-2 text-muted-foreground hover:text-destructive"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4" />
            Cerrar Sesión
          </Button>
        </div>
      </div>
    </aside>
  );
}