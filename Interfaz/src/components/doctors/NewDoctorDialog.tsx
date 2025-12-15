import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Specialty, specialtyLabels } from '@/types/clinic';
import { UserPlus, User, Mail, Lock, Stethoscope, CreditCard } from 'lucide-react'; // 1. Importar CreditCard
import { toast } from 'sonner';

interface NewDoctorDialogProps {
  onDoctorCreated?: (doctor: any) => void;
}

export function NewDoctorDialog({ onDoctorCreated }: NewDoctorDialogProps) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Estados del formulario
  const [name, setName] = useState('');
  const [ci, setCi] = useState(''); // 2. Nuevo estado para CI
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [specialty, setSpecialty] = useState<Specialty>('medicina-general');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Mock para desarrollo
      await new Promise(resolve => setTimeout(resolve, 500));

      const newDoctor = {
        id: `doc_${Date.now()}`,
        name,
        ci, // 3. Incluir CI en el objeto
        email,
        specialty,
        role: 'medico',
      };

      toast.success(`Dr. ${name} creado exitosamente`);
      onDoctorCreated?.(newDoctor);
      
      // Reset form
      setName('');
      setCi('');
      setEmail('');
      setPassword('');
      setSpecialty('medicina-general');
      setOpen(false);
    } catch (error) {
      toast.error('Error al crear médico');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <UserPlus className="h-4 w-4" />
          Nuevo Médico
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Registrar Nuevo Médico</DialogTitle>
          <DialogDescription>
            Crea una cuenta para un nuevo médico del sistema.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Nombre */}
          <div className="space-y-2">
            <Label htmlFor="doctor-name">Nombre completo</Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="doctor-name"
                placeholder="Dr. Juan Pérez"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="pl-9"
                required
              />
            </div>
          </div>

          {/* 4. Campo de CI */}
          <div className="space-y-2">
            <Label htmlFor="doctor-ci">Cédula de Identidad</Label>
            <div className="relative">
              <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="doctor-ci"
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
            <Label htmlFor="doctor-email">Correo electrónico</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="doctor-email"
                type="email"
                placeholder="doctor@clinica.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-9"
                required
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-2">
            <Label htmlFor="doctor-password">Contraseña temporal</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="doctor-password"
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

          {/* Especialidad */}
          <div className="space-y-2">
            <Label htmlFor="doctor-specialty">Especialidad</Label>
            <Select value={specialty} onValueChange={(v) => setSpecialty(v as Specialty)}>
              <SelectTrigger>
                <div className="flex items-center gap-2">
                  <Stethoscope className="h-4 w-4 text-muted-foreground" />
                  <SelectValue />
                </div>
              </SelectTrigger>
              <SelectContent>
                {Object.entries(specialtyLabels).map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Creando...' : 'Crear Médico'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}