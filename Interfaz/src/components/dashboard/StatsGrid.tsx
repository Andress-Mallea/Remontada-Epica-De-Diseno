import { Calendar, Clock, Users, CheckCircle, AlertCircle, XCircle } from "lucide-react";
import { useAppointments } from "@/context/AppointmentsContext";
import { AppointmentStatus } from "@/types/clinic";

interface StatCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  description?: string;
  trend?: "up" | "down" | "neutral";
}

function StatCard({ title, value, icon, description }: StatCardProps) {
  return (
    <div className="bg-card rounded-xl p-6 shadow-card border border-border/50 animate-fade-in">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="mt-2 text-3xl font-bold text-card-foreground">{value}</p>
          {description && (
            <p className="mt-1 text-xs text-muted-foreground">{description}</p>
          )}
        </div>
        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
          {icon}
        </div>
      </div>
    </div>
  );
}
export function StatsGrid() {
  const { appointments } = useAppointments();

  // Función auxiliar para comparar estados de forma segura
  const checkStatus = (currentStatus: string, target: string) => 
    currentStatus?.toLowerCase() === target.toLowerCase();

  const stats = {
    total: appointments.length,
    // Asegúrate de que estos strings coincidan con el mapeo del Contexto
    solicitadas: appointments.filter((a) => checkStatus(a.status, "solicitada")).length,
    confirmadas: appointments.filter((a) => checkStatus(a.status, "confirmada")).length,
    atendidas: appointments.filter((a) => checkStatus(a.status, "atendida")).length,
    canceladas: appointments.filter((a) => checkStatus(a.status, "cancelada")).length,
    
    today: appointments.filter((a) => {
      if (!a.date) return false;
      // Extraemos la fecha pura YYYY-MM-DD
      const appointmentDate = a.date.split("T")[0];
      
      // Fecha de hoy en formato YYYY-MM-DD local
      const now = new Date();
      const todayDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
      
      return appointmentDate === todayDate && !checkStatus(a.status, "cancelada");
    }).length,
  };

  // EL HTML SE MANTIENE EXACTAMENTE IGUAL A TU DISEÑO ORIGINAL
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatCard
        title="Citas Hoy"
        value={stats.today}
        icon={<Calendar className="h-6 w-6 text-primary" />}
        description="Programadas para hoy"
      />
      <StatCard
        title="Pendientes"
        value={stats.solicitadas}
        icon={<Clock className="h-6 w-6 text-warning" />}
        description="Esperando confirmación"
      />
      <StatCard
        title="Confirmadas"
        value={stats.confirmadas}
        icon={<CheckCircle className="h-6 w-6 text-primary" />}
        description="Listas para atender"
      />
      <StatCard
        title="Atendidas"
        value={stats.atendidas}
        icon={<Users className="h-6 w-6 text-success" />}
        description="Consultas completadas"
      />
    </div>
  );
}