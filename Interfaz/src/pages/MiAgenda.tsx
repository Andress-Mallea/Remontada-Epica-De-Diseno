import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { useAuth } from "@/context/AuthContext";
import { useAppointments } from "@/context/AppointmentsContext";
import { AttendanceDialog } from "@/components/appointments/AttendanceDialog";
import { AppointmentDetailsDialog } from "@/components/appointments/AppointmentDetailsDialog";
import { StatusBadge } from "@/components/ui/status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Appointment } from "@/types/clinic";
import { format, parseISO, isToday, isTomorrow } from "date-fns";
import { es } from "date-fns/locale";
import { 
  Calendar, 
  Clock, 
  User, 
  FileText, 
  Eye, 
  ClipboardCheck, 
  CalendarDays, 
  XCircle, 
  Stethoscope, // Importación corregida
  Loader2      // Importación agregada para pantalla de carga
} from "lucide-react";
import { toast } from "sonner";

export default function MiAgenda() {
  const { user, hasRole, isLoading } = useAuth(); // Agregamos isLoading
  const { appointments, updateAppointmentStatus } = useAppointments();
  
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [attendanceDialogOpen, setAttendanceDialogOpen] = useState(false);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);

  // 1. PANTALLA DE CARGA (Evita la pantalla blanca)
  if (isLoading || !user) {
    return (
      <MainLayout>
        <div className="h-[50vh] flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </MainLayout>
    );
  }

  // 2. FILTRO INTELIGENTE
  const myAppointments = appointments.filter((apt) => {
    if (hasRole('medico')) return apt.doctorId === user.id;
    if (hasRole('paciente')) return apt.patientId === user.id;
    return false;
  });

  // Estadísticas
  const todayAppointments = myAppointments.filter((apt) => isToday(parseISO(apt.date)));
  const pendingAppointments = myAppointments.filter((apt) => apt.status === 'confirmada' || apt.status === 'solicitada');
  const completedToday = todayAppointments.filter((apt) => apt.status === 'atendida');

  // Citas próximas
  const upcomingAppointments = myAppointments
    .filter((apt) => {
      const aptDate = parseISO(apt.date);
      const isFuture = isToday(aptDate) || isTomorrow(aptDate); 
      // Si es paciente, mostramos solicitadas y confirmadas. Si es médico, igual.
      return isFuture && (apt.status === 'confirmada' || apt.status === 'solicitada');
    })
    .sort((a, b) => {
      const dateComparison = new Date(a.date).getTime() - new Date(b.date).getTime();
      if (dateComparison !== 0) return dateComparison;
      return a.startTime.localeCompare(b.startTime);
    });

  const handleAttendance = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setAttendanceDialogOpen(true);
  };

  const handleViewDetails = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setDetailsDialogOpen(true);
  };

  const handleCancel = (appointment: Appointment) => {
    updateAppointmentStatus(appointment.id, 'cancelada');
    toast.info("Cita cancelada exitosamente");
  };

  const getDateLabel = (dateStr: string) => {
    const date = parseISO(dateStr);
    if (isToday(date)) return "Hoy";
    if (isTomorrow(date)) return "Mañana";
    return format(date, "EEEE d 'de' MMMM", { locale: es });
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-foreground">Mi Agenda</h1>
          <p className="text-muted-foreground">
            {hasRole('medico') 
              ? 'Gestiona tus citas y registra atenciones médicas' 
              : 'Revisa tus próximas citas médicas'}
          </p>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card className="shadow-card">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Citas Hoy</CardTitle>
              <CalendarDays className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{todayAppointments.length}</p>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {hasRole('medico') ? 'Por Atender' : 'Pendientes'}
              </CardTitle>
              <Clock className="h-4 w-4 text-warning" />
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-warning">{pendingAppointments.length}</p>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Atendidas Hoy</CardTitle>
              <ClipboardCheck className="h-4 w-4 text-success" />
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-success">{completedToday.length}</p>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Citas</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{myAppointments.length}</p>
            </CardContent>
          </Card>
        </div>

        {/* Upcoming Appointments Table */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              Próximas Citas
            </CardTitle>
          </CardHeader>
          <CardContent>
            {upcomingAppointments.length === 0 ? (
              <p className="text-center py-8 text-muted-foreground">
                No tienes citas programadas para hoy o mañana
              </p>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Fecha</TableHead>
                      <TableHead>Hora</TableHead>
                      {/* Cabeceras dinámicas según rol */}
                      {hasRole('medico') && <TableHead>Paciente</TableHead>}
                      {hasRole('paciente') && <TableHead>Médico</TableHead>}
                      {hasRole('medico') && <TableHead>CI</TableHead>}
                      <TableHead>Estado</TableHead>
                      <TableHead className="text-right">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {upcomingAppointments.map((appointment) => (
                      <TableRow key={appointment.id}>
                        <TableCell>
                          <span className={isToday(parseISO(appointment.date)) ? "font-semibold text-primary" : ""}>
                            {getDateLabel(appointment.date)}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3 text-muted-foreground" />
                            {appointment.startTime} - {appointment.endTime}
                          </div>
                        </TableCell>
                        
                        {/* Celda Paciente (Solo visible para Médicos) */}
                        {hasRole('medico') && (
                          <>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <User className="h-4 w-4 text-muted-foreground" />
                                {appointment.patientName}
                              </div>
                            </TableCell>
                            <TableCell className="text-muted-foreground">
                              {appointment.patientCi}
                            </TableCell>
                          </>
                        )}

                        {/* Celda Médico (Solo visible para Pacientes) */}
                        {hasRole('paciente') && (
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Stethoscope className="h-4 w-4 text-muted-foreground" />
                              {appointment.doctorName}
                            </div>
                          </TableCell>
                        )}

                        <TableCell>
                          <StatusBadge status={appointment.status} />
                        </TableCell>
                        
                        {/* Acciones */}
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            {/* Ver Detalles (Para todos) */}
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleViewDetails(appointment)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>

                            {/* Registrar Atención (Solo Médicos) */}
                            {hasRole('medico') && appointment.status === 'confirmada' && (
                              <Button
                                size="sm"
                                className="gap-1"
                                onClick={() => handleAttendance(appointment)}
                              >
                                <ClipboardCheck className="h-4 w-4" />
                                Registrar Atención
                              </Button>
                            )}

                            {/* Cancelar Cita (Solo Pacientes) */}
                            {hasRole('paciente') && (appointment.status === 'confirmada' || appointment.status === 'solicitada') && (
                              <Button
                                size="sm"
                                variant="ghost"
                                className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                onClick={() => handleCancel(appointment)}
                                title="Cancelar Cita"
                              >
                                <XCircle className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Dialogs */}
        {selectedAppointment && (
          <>
            <AttendanceDialog
              appointment={selectedAppointment}
              open={attendanceDialogOpen}
              onOpenChange={setAttendanceDialogOpen}
            />
            <AppointmentDetailsDialog
              appointment={selectedAppointment}
              open={detailsDialogOpen}
              onOpenChange={setDetailsDialogOpen}
            />
          </>
        )}
      </div>
    </MainLayout>
  );
}