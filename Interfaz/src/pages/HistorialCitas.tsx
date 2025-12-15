import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { useAppointments } from "@/context/AppointmentsContext";
import { AppointmentDetailsDialog } from "@/components/appointments/AppointmentDetailsDialog";
import { StatusBadge } from "@/components/ui/status-badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format, parseISO } from "date-fns";
import { es } from "date-fns/locale";
import { Search, Eye, FileText, CalendarCheck } from "lucide-react";
import { Appointment, specialtyLabels } from "@/types/clinic";

export default function HistorialCitas() {
  const { appointments } = useAppointments();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);

  // 1. Filtrar solo citas ATENDIDAS (Historial)
  const historyAppointments = appointments.filter((apt) => {
    const isCompleted = apt.status === 'atendida';
    const matchesSearch =
      apt.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      apt.patientCi.includes(searchTerm) ||
      apt.doctorName.toLowerCase().includes(searchTerm.toLowerCase());
    
    return isCompleted && matchesSearch;
  });

  // Ordenar: Las más recientes primero
  const sortedHistory = [...historyAppointments].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const handleViewDetails = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setDetailsDialogOpen(true);
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-foreground">Historial de Citas</h1>
          <p className="text-muted-foreground">
            Registro de todas las consultas médicas completadas y sus diagnósticos.
          </p>
        </div>

        {/* Search */}
        <div className="bg-card rounded-xl p-4 shadow-card border border-border/50">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por paciente, CI o médico..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        {/* Table */}
        <Card className="shadow-card border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <CalendarCheck className="h-5 w-5 text-primary" />
              Citas Atendidas ({sortedHistory.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead>Fecha</TableHead>
                    <TableHead>Paciente</TableHead>
                    <TableHead>Médico</TableHead>
                    <TableHead>Especialidad</TableHead>
                    <TableHead>Diagnóstico Breve</TableHead>
                    <TableHead className="text-right">Detalles</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedHistory.map((appointment) => (
                    <TableRow key={appointment.id} className="hover:bg-muted/30">
                      <TableCell>
                        <div className="font-medium">
                          {format(parseISO(appointment.date), "dd MMM yyyy", { locale: es })}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {appointment.startTime}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{appointment.patientName}</p>
                          <p className="text-xs text-muted-foreground">CI: {appointment.patientCi}</p>
                        </div>
                      </TableCell>
                      <TableCell>{appointment.doctorName}</TableCell>
                      <TableCell>{specialtyLabels[appointment.specialty]}</TableCell>
                      <TableCell className="max-w-[200px]">
                        <p className="truncate text-sm text-muted-foreground italic">
                          {appointment.diagnosis || "Sin diagnóstico registrado"}
                        </p>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleViewDetails(appointment)}
                          title="Ver Informe Médico"
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          Ver Informe
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  {sortedHistory.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} className="h-32 text-center text-muted-foreground">
                        No hay citas en el historial.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        <AppointmentDetailsDialog
          appointment={selectedAppointment}
          open={detailsDialogOpen}
          onOpenChange={setDetailsDialogOpen}
        />
      </div>
    </MainLayout>
  );
}