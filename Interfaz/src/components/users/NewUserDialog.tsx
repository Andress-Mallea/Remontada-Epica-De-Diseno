import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UserPlus, User, Mail, Lock, Shield, CreditCard } from 'lucide-react'; // Importamos CreditCard
import { toast } from 'sonner';
import { UserRole, roleLabels } from '@/types/auth';

interface NewUserDialogProps {
  onUserCreated?: (user: any) => void;
}

export function NewUserDialog({ onUserCreated }: NewUserDialogProps) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Estados del formulario
  const [name, setName] = useState('');
  const [ci, setCi] = useState(''); // 1. Nuevo estado para CI
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('recepcion');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Simulación de delay
      await new Promise(resolve => setTimeout(resolve, 500));

      const newUser = {
        id: `user_${Date.now()}`,
        name,
        ci, // 2. Incluir CI al crear el usuario
        email,
        role,
        // En un backend real, la contraseña se hashea, aquí solo simulamos
      };

      toast.success(`Usuario ${name} creado exitosamente`);
      onUserCreated?.(newUser);
      
      // Limpiar formulario
      setName('');
      setCi('');
      setEmail('');
      setPassword('');
      setRole('recepcion');
      setOpen(false);
    } catch (error) {
      toast.error('Error al crear usuario');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <UserPlus className="h-4 w-4" />
          Nuevo Usuario
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Registrar Nuevo Usuario</DialogTitle>
          <DialogDescription>
            Agrega un nuevo administrador o recepcionista al sistema.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Nombre */}
          <div className="space-y-2">
            <Label htmlFor="user-name">Nombre completo</Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="user-name"
                placeholder="Nombre y Apellido"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="pl-9"
                required
              />
            </div>
          </div>

          {/* 3. Campo de CI */}
          <div className="space-y-2">
            <Label htmlFor="user-ci">Cédula de Identidad</Label>
            <div className="relative">
              <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="user-ci"
                placeholder="12345678"
                value={ci}
                onChange={(e) => setCi(e.target.value)}
                className="pl-9"
                required
              />
            </div>
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="user-email">Correo electrónico</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="user-email"
                type="email"
                placeholder="usuario@clinica.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-9"
                required
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-2">
            <Label htmlFor="user-password">Contraseña</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="user-password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-9"
                minLength={6}
                required
              />
            </div>
          </div>

          {/* Rol */}
          <div className="space-y-2">
            <Label htmlFor="user-role">Rol del sistema</Label>
            <Select value={role} onValueChange={(v) => setRole(v as UserRole)}>
              <SelectTrigger>
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-muted-foreground" />
                  <SelectValue />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recepcion">Recepción</SelectItem>
                <SelectItem value="administrador">Administrador</SelectItem>
                {/* Opcional: Si quieres permitir crear médicos desde aquí también */}
                {/* <SelectItem value="medico">Médico</SelectItem> */}
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Creando...' : 'Crear Usuario'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}