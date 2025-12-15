import { useState } from "react";
import { format, parseISO, isToday } from "date-fns";
import { es } from "date-fns/locale";
import { 
  Calendar, 
  Clock, 
  CheckCircle, 
  FileText, 
  Eye, 
  Stethoscope,
  PlayCircle 
} from "lucide-react";
import { useAppointments } from "@/context/AppointmentsContext";
import { useAuth } from "@/context/AuthContext";
import { StatusBadge } from "@/components/ui/status-badge";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { AttendanceDialog } from "@/components/appointments/AttendanceDialog";
import { AppointmentDetailsDialog } from "@/components/appointments/AppointmentDetailsDialog";
import { Appointment } from "@/types/clinic";

export function DoctorAgenda() {
  const { user } = useAuth();
  const { appointments } = useAppointments();
  
  // Estados para controlar los diálogos
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [showAttendance, setShowAttendance] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  // 1. Filtrar citas: Solo las de este médico
  const myAppointments = appointments
    .filter((apt) => apt.doctorId === user?.id && apt.status !== "cancelada")
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  // 2. Calcular estadísticas
  const todayStr = new Date().toISOString().split("T")[0];
  
  const stats = {
    today: myAppointments.filter((a) => a.date === todayStr).length,
    pending: myAppointments.filter((a) => a.status === "confirmada" || a.status === "solicitada").length,
    attendedToday: myAppointments.filter((a) => a.date === todayStr && a.status === "atendida").length,
    total: myAppointments.length
  };

  // Manejadores de acciones
  const handleAttend = (apt: Appointment) => {
    setSelectedAppointment(apt);
    setShowAttendance(true);
  };

  const handleViewDetails = (apt: Appointment) => {
    setSelectedAppointment(apt);
    setShowDetails(true);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Mi Agenda</h2>
        <p className="text-muted-foreground">Gestiona tus citas y registra atenciones médicas</p>
      </div>

      {/* Tarjetas de Estadísticas */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="bg-card p-6 rounded-xl border border-border/50 shadow-sm flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Citas Hoy</p>
            <p className="text-3xl font-bold mt-2">{stats.today}</p>
          </div>
          <Calendar className="h-5 w-5 text-primary" />
        </div>
        <div className="bg-card p-6 rounded-xl border border-border/50 shadow-sm flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Por Atender</p>
            <p className="text-3xl font-bold mt-2">{stats.pending}</p>
          </div>
          <Clock className="h-5 w-5 text-warning" />
        </div>
        <div className="bg-card p-6 rounded-xl border border-border/50 shadow-sm flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Atendidas Hoy</p>
            <p className="text-3xl font-bold mt-2">{stats.attendedToday}</p>
          </div>
          <CheckCircle className="h-5 w-5 text-success" />
        </div>
        <div className="bg-card p-6 rounded-xl border border-border/50 shadow-sm flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Total Citas</p>
            <p className="text-3xl font-bold mt-2">{stats.total}</p>
          </div>
          <FileText className="h-5 w-5 text-muted-foreground" />
        </div>
      </div>

      {/* Tabla de Próximas Citas */}
      <div className="bg-card rounded-xl border border-border/50 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-border">
          <h3 className="font-semibold flex items-center gap-2">
            <Calendar className="h-4 w-4 text-primary" />
            Próximas Citas
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-muted/50 text-muted-foreground font-medium">
              <tr>
                <th className="px-6 py-3">Fecha</th>
                <th className="px-6 py-3">Hora</th>
                <th className="px-6 py-3">Paciente</th>
                <th className="px-6 py-3">CI</th>
                <th className="px-6 py-3">Estado</th>
                <th className="px-6 py-3 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {myAppointments.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-muted-foreground">
                    No tienes citas programadas próximamente.
                  </td>
                </tr>
              ) : (
                myAppointments.map((apt) => (
                  <tr key={apt.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4 font-medium">
                      {isToday(parseISO(apt.date)) 
                        ? "Hoy" 
                        : format(parseISO(apt.date), "d MMM", { locale: es })}
                    </td>
                    <td className="px-6 py-4 flex items-center gap-2">
                      <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                      {apt.startTime} - {apt.endTime}
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-card-foreground">{apt.patientName}</div>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">{apt.patientCi}</td>
                    <td className="px-6 py-4">
                      <StatusBadge status={apt.status} />
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <TooltipProvider>
                          {/* Botón Ver Detalles - Visible Siempre */}
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-8 w-8 hover:text-primary"
                                onClick={() => handleViewDetails(apt)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Ver detalles</TooltipContent>
                          </Tooltip>

                          {/* Botón ATENDER - Solo visible si está confirmada o solicitada */}
                          {(apt.status === "confirmada" || apt.status === "solicitada") && (
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  className="h-8 w-8 text-primary hover:text-primary hover:bg-primary/10"
                                  onClick={() => handleAttend(apt)}
                                >
                                  <Stethoscope className="h-4 w-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>Registrar Atención</TooltipContent>
                            </Tooltip>
                          )}
                          
                          {/* Indicador de Atendida */}
                          {apt.status === "atendida" && (
                             <CheckCircle className="h-4 w-4 text-success opacity-50 ml-2" />
                          )}
                        </TooltipProvider>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Diálogos */}
      <AttendanceDialog 
        open={showAttendance} 
        onOpenChange={setShowAttendance} 
        appointment={selectedAppointment}
      />
      
      <AppointmentDetailsDialog 
        open={showDetails} 
        onOpenChange={setShowDetails} 
        appointment={selectedAppointment}
      />
    </div>
  );
}