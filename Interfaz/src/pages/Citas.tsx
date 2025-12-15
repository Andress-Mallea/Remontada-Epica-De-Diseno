import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { NewAppointmentDialog } from "@/components/appointments/NewAppointmentDialog";
import { AttendanceDialog } from "@/components/appointments/AttendanceDialog";
import { AppointmentDetailsDialog } from "@/components/appointments/AppointmentDetailsDialog";
import { StatusBadge } from "@/components/ui/status-badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { format, parseISO } from "date-fns";
import { es } from "date-fns/locale";
import { 
  Search, 
  Filter, 
  FileText, 
  CheckCircle, 
  XCircle, 
  ClipboardCheck,
  Calendar,
  AlertCircle,
  Mail,
  Bell,
  Smartphone
} from "lucide-react";
import { useAppointments } from "@/context/AppointmentsContext";
import { useAuth } from "@/context/AuthContext"; // 1. Importar useAuth
import { doctors } from "@/data/mockData";
import { Appointment, AppointmentStatus, specialtyLabels, statusLabels } from "@/types/clinic";
import { toast } from "sonner";

export default function Citas() {
  const { hasRole } = useAuth(); // 2. Obtener la función hasRole
  const { appointments, updateAppointmentStatus } = useAppointments();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<AppointmentStatus | "all">("all");
  const [doctorFilter, setDoctorFilter] = useState<string>("all");
  
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [attendanceDialogOpen, setAttendanceDialogOpen] = useState(false);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [reminderDialogOpen, setReminderDialogOpen] = useState(false);
  const [appointmentForReminder, setAppointmentForReminder] = useState<Appointment | null>(null);

  const stats = {
    total: appointments.length,
    solicitadas: appointments.filter(a => a.status === "solicitada").length,
    confirmadas: appointments.filter(a => a.status === "confirmada").length,
    atendidas: appointments.filter(a => a.status === "atendida").length,
  };

  const filteredAppointments = appointments.filter((apt) => {
    const matchesSearch =
      apt.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      apt.patientCi.includes(searchTerm) ||
      apt.doctorName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || apt.status === statusFilter;
    const matchesDoctor = doctorFilter === "all" || apt.doctorId === doctorFilter;
    return matchesSearch && matchesStatus && matchesDoctor;
  });

  const sortedAppointments = [...filteredAppointments].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const handleAttendance = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setAttendanceDialogOpen(true);
  };

  const handleViewDetails = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setDetailsDialogOpen(true);
  };

  const handleConfirm = (appointment: Appointment) => {
    updateAppointmentStatus(appointment.id, "confirmada");
    setTimeout(() => {
      toast.info(
        <div className="flex items-center gap-2">
          <Mail className="h-4 w-4" />
          <span>Confirmación enviada a {appointment.patientName}</span>
        </div>,
        { duration: 3000 }
      );
    }, 500);
  };

  const handleCancel = (appointment: Appointment) => {
    updateAppointmentStatus(appointment.id, "cancelada");
    setTimeout(() => {
      toast.info(
        <div className="flex items-center gap-2">
          <Bell className="h-4 w-4" />
          <span>Notificación de cancelación enviada a {appointment.patientName}</span>
        </div>,
        { duration: 3000 }
      );
    }, 500);
  };

  const openReminderOptions = (appointment: Appointment) => {
    setAppointmentForReminder(appointment);
    setReminderDialogOpen(true);
  };

  const handleSendEmail = () => {
    if (!appointmentForReminder) return;
    setReminderDialogOpen(false);
    toast.success(
      <div className="flex items-center gap-2">
        <Mail className="h-4 w-4" />
        <div>
          <p className="font-bold">Correo Enviado</p>
          <span className="text-xs">Recordatorio enviado a {appointmentForReminder.patientName} via Email</span>
        </div>
      </div>,
      { duration: 4000 }
    );
  };

  const handleSendSMS = () => {
    if (!appointmentForReminder) return;
    setReminderDialogOpen(false);
    toast.success(
      <div className="flex items-center gap-2">
        <Smartphone className="h-4 w-4" />
        <div>
          <p className="font-bold">SMS Enviado</p>
          <span className="text-xs">Mensaje de texto enviado al celular del paciente</span>
        </div>
      </div>,
      { duration: 4000 }
    );
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Gestión de Citas</h1>
            <p className="text-muted-foreground">
              Administre las citas médicas de la clínica
            </p>
          </div>
          <NewAppointmentDialog />
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Calendar className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.total}</p>
                  <p className="text-xs text-muted-foreground">Total Citas</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-warning/30 bg-warning/5">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-warning/10 rounded-lg">
                  <AlertCircle className="h-5 w-5 text-warning" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.solicitadas}</p>
                  <p className="text-xs text-muted-foreground">Pendientes</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-primary/30 bg-primary/5">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.confirmadas}</p>
                  <p className="text-xs text-muted-foreground">Confirmadas</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-success/30 bg-success/5">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-success/10 rounded-lg">
                  <ClipboardCheck className="h-5 w-5 text-success" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.atendidas}</p>
                  <p className="text-xs text-muted-foreground">Atendidas</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="bg-card rounded-xl p-4 shadow-card border border-border/50">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por paciente, CI o médico..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as AppointmentStatus | "all")}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los estados</SelectItem>
                {Object.entries(statusLabels).map(([key, label]) => (
                  <SelectItem key={key} value={key}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={doctorFilter} onValueChange={setDoctorFilter}>
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue placeholder="Médico" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los médicos</SelectItem>
                {doctors.map((doctor) => (
                  <SelectItem key={doctor.id} value={doctor.id}>
                    {doctor.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Table */}
        <div className="bg-card rounded-xl shadow-card border border-border/50 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead>Paciente</TableHead>
                <TableHead>Médico</TableHead>
                <TableHead>Especialidad</TableHead>
                <TableHead>Fecha y Hora</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedAppointments.map((appointment) => (
                <TableRow 
                  key={appointment.id} 
                  className="hover:bg-muted/30 cursor-pointer"
                  onClick={() => handleViewDetails(appointment)}
                >
                  <TableCell>
                    <div>
                      <p className="font-medium">{appointment.patientName}</p>
                      <p className="text-xs text-muted-foreground">CI: {appointment.patientCi}</p>
                    </div>
                  </TableCell>
                  <TableCell>{appointment.doctorName}</TableCell>
                  <TableCell>{specialtyLabels[appointment.specialty]}</TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">
                        {format(parseISO(appointment.date), "d 'de' MMMM, yyyy", { locale: es })}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {appointment.startTime} - {appointment.endTime}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={appointment.status} />
                  </TableCell>
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <div className="flex justify-end gap-1">
                      {appointment.status === "solicitada" && (
                        <>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-8 w-8 p-0 text-primary hover:text-primary hover:bg-primary/10"
                            onClick={() => handleConfirm(appointment)}
                            title="Confirmar"
                          >
                            <CheckCircle className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                            onClick={() => handleCancel(appointment)}
                            title="Cancelar"
                          >
                            <XCircle className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                      
                      {/* ACCIONES PARA CITAS CONFIRMADAS */}
                      {appointment.status === "confirmada" && (
                        <>
                          {/* Notificación: Visible para todos (admin, recepción, médico) */}
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground hover:bg-muted"
                            onClick={() => openReminderOptions(appointment)}
                            title="Enviar Recordatorio"
                          >
                            <Bell className="h-4 w-4" />
                          </Button>

                          {/* 3. Botón Registrar Atención: SOLO MÉDICOS */}
                          {hasRole('medico') && (
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-8 w-8 p-0 text-success hover:text-success hover:bg-success/10"
                              onClick={() => handleAttendance(appointment)}
                              title="Registrar Atención"
                            >
                              <ClipboardCheck className="h-4 w-4" />
                            </Button>
                          )}

                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                            onClick={() => handleCancel(appointment)}
                            title="Cancelar"
                          >
                            <XCircle className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                      
                      {appointment.status === "atendida" && (
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
                          onClick={() => handleViewDetails(appointment)}
                          title="Ver detalles"
                        >
                          <FileText className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {sortedAppointments.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="h-32 text-center text-muted-foreground">
                    No se encontraron citas con los filtros aplicados
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <Dialog open={reminderDialogOpen} onOpenChange={setReminderDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Enviar Recordatorio</DialogTitle>
            <DialogDescription>
              Seleccione el medio por el cual desea notificar a <b>{appointmentForReminder?.patientName}</b>.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid grid-cols-2 gap-4 py-4">
            <Button 
              variant="outline" 
              className="h-24 flex flex-col items-center justify-center gap-2 hover:bg-primary/5 hover:border-primary/50 transition-all"
              onClick={handleSendEmail}
            >
              <Mail className="h-8 w-8 text-primary" />
              <span className="font-medium">Enviar Email</span>
            </Button>

            <Button 
              variant="outline" 
              className="h-24 flex flex-col items-center justify-center gap-2 hover:bg-primary/5 hover:border-primary/50 transition-all"
              onClick={handleSendSMS}
            >
              <Smartphone className="h-8 w-8 text-primary" />
              <span className="font-medium">Enviar SMS</span>
            </Button>
          </div>
        </DialogContent>
      </Dialog>

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
    </MainLayout>
  );
}