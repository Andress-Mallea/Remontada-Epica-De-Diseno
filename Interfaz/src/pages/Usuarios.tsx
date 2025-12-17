import { MainLayout } from "@/components/layout/MainLayout";
import { useAuth } from "@/context/AuthContext";
import { NewUserDialog } from "@/components/users/NewUserDialog";
import { roleLabels } from "@/types/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User, Mail, Shield, CreditCard } from "lucide-react"; // 1. Importar CreditCard

// 2. Agregar campo CI a los usuarios mock
const mockUsers = [
  { 
    id: '1', 
    name: 'Administrador General', 
    ci: '1111111', // CI agregado
    email: 'admin@clinica.com', 
    role: 'administrador' as const 
  },
  { 
    id: '2', 
    name: 'María García', 
    ci: '2222222', // CI agregado
    email: 'recepcion@clinica.com', 
    role: 'recepcion' as const 
  },
  { 
    id: '3', 
    name: 'Dr. Carlos Rodríguez', 
    ci: '3333333', // CI agregado
    email: 'medico@clinica.com', 
    role: 'medico' as const, 
    specialty: 'medicina-general' 
  },
  { 
    id: '4', 
    name: 'Juan Pérez', 
    ci: '12345678', // CI agregado
    email: 'paciente@clinica.com', 
    role: 'paciente' as const 
  },
];

export default function Usuarios() {
  const { hasRole } = useAuth();

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'administrador': return 'default';
      case 'medico': return 'secondary';
      case 'recepcion': return 'outline';
      case 'paciente': return 'secondary'; // Variante para paciente
      default: return 'secondary';
    }
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Gestión de Usuarios</h1>
            <p className="text-muted-foreground">
              Administra los usuarios del sistema
            </p>
          </div>
          {hasRole('ADMINISTRATOR') && <NewUserDialog />}
        </div>

        {/* Users Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {mockUsers.map((user) => (
            <Card key={user.id} className="shadow-card animate-fade-in hover:shadow-elevated transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                    <User className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-lg">{user.name}</CardTitle>
                    <Badge variant={getRoleBadgeVariant(user.role)} className="mt-1">
                      {roleLabels[user.role]}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                {/* 3. Mostrar el CI en la tarjeta */}
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CreditCard className="h-4 w-4" />
                  <span>CI: {user.ci}</span>
                </div>
                
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Mail className="h-4 w-4" />
                  <span className="truncate">{user.email}</span>
                </div>
                
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Shield className="h-4 w-4" />
                  <span>Acceso: {user.role === 'administrador' ? 'Total' : 'Limitado'}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </MainLayout>
  );
}