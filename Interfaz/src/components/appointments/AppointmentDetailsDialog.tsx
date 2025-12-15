import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { StatusBadge } from "@/components/ui/status-badge";
import { Appointment, specialtyLabels } from "@/types/clinic";
import { format, parseISO } from "date-fns";
import { es } from "date-fns/locale";
import { User, Stethoscope, Calendar, Clock, FileText, ClipboardList, MessageSquare, Lock } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/context/AuthContext";
//comentarioo
interface AppointmentDetailsDialogProps {
  appointment: Appointment | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AppointmentDetailsDialog({ appointment, open, onOpenChange }: AppointmentDetailsDialogProps) {
  const { hasRole } = useAuth();

  if (!appointment) return null;

  // CAMBIO: Definimos quién puede ver los detalles médicos (diagnóstico)
  // Ahora incluimos 'administrador' y 'recepcion' además de 'medico'
  const canViewMedicalDetails = hasRole(['medico', 'administrador', 'recepcion']);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        {/* ... (Header y Datos generales iguales) ... */}
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            Detalles de la Cita
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 mt-2">
           {/* ... (Bloques de Paciente, Doctor, Fecha se mantienen igual) ... */}
           
           <div className="flex justify-center">
            <StatusBadge status={appointment.status} className="text-sm px-4 py-1" />
          </div>

          <div className="bg-muted/50 rounded-lg p-4 space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <User className="h-4 w-4" />
              Paciente
            </div>
            <p className="font-semibold text-lg">{appointment.patientName}</p>
            <p className="text-sm text-muted-foreground">CI: {appointment.patientCi}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-muted/50 rounded-lg p-4 space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <Stethoscope className="h-4 w-4" />
                Médico
              </div>
              <p className="font-medium">{appointment.doctorName}</p>
            </div>
            <div className="bg-muted/50 rounded-lg p-4 space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <ClipboardList className="h-4 w-4" />
                Especialidad
              </div>
              <p className="font-medium">{specialtyLabels[appointment.specialty]}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-muted/50 rounded-lg p-4 space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <Calendar className="h-4 w-4" />
                Fecha
              </div>
              <p className="font-medium">
                {format(parseISO(appointment.date), "d 'de' MMMM, yyyy", { locale: es })}
              </p>
            </div>
            <div className="bg-muted/50 rounded-lg p-4 space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <Clock className="h-4 w-4" />
                Hora
              </div>
              <p className="font-medium">{appointment.startTime} - {appointment.endTime}</p>
            </div>
          </div>

          {/* Attendance Details */}
          {appointment.status === "atendida" && (
            <>
              <Separator />
              {/* CAMBIO: Usamos la nueva variable canViewMedicalDetails */}
              {canViewMedicalDetails ? (
                <div className="space-y-4">
                  <h3 className="font-semibold flex items-center gap-2">
                    <FileText className="h-4 w-4 text-success" />
                    Registro de Atención (Informe Médico)
                  </h3>
                  
                  {appointment.reason && (
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">Motivo de Consulta</p>
                      <p className="bg-muted/30 rounded-lg p-3 text-sm">{appointment.reason}</p>
                    </div>
                  )}
                  
                  {appointment.diagnosis && (
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">Diagnóstico</p>
                      <p className="bg-success/10 rounded-lg p-3 text-sm border border-success/20">
                        {appointment.diagnosis}
                      </p>
                    </div>
                  )}
                  
                  {appointment.notes && (
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                        <MessageSquare className="h-3 w-3" />
                        Notas Adicionales
                      </div>
                      <p className="bg-muted/30 rounded-lg p-3 text-sm italic">{appointment.notes}</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2 p-4 bg-muted/30 rounded-lg text-muted-foreground">
                  <Lock className="h-4 w-4" />
                  <span className="text-sm">El diagnóstico es confidencial.</span>
                </div>
              )}
            </>
          )}

          <Separator />
          <div className="text-xs text-muted-foreground space-y-1">
            <p>Creada: {format(parseISO(appointment.createdAt), "d MMM yyyy, HH:mm", { locale: es })}</p>
            <p>Última actualización: {format(parseISO(appointment.updatedAt), "d MMM yyyy, HH:mm", { locale: es })}</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}