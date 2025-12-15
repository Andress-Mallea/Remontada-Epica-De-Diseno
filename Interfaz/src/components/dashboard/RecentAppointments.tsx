import { format, parseISO } from "date-fns";
import { es } from "date-fns/locale";
import { Clock, User, Stethoscope } from "lucide-react";
import { useAppointments } from "@/context/AppointmentsContext";
import { StatusBadge } from "@/components/ui/status-badge";
import { Button } from "@/components/ui/button";
import { specialtyLabels } from "@/types/clinic";

export function RecentAppointments() {
  const { appointments, updateAppointmentStatus } = useAppointments();

  const recentAppointments = [...appointments]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  return (
    <div className="bg-card rounded-xl shadow-card border border-border/50 animate-fade-in">
      <div className="border-b border-border p-4">
        <h3 className="text-lg font-semibold text-card-foreground">Citas Recientes</h3>
        <p className="text-sm text-muted-foreground">Últimas solicitudes de citas</p>
      </div>
      <div className="divide-y divide-border">
        {recentAppointments.map((appointment) => (
          <div key={appointment.id} className="p-4 hover:bg-muted/30 transition-colors">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium text-card-foreground truncate">
                    {appointment.patientName}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    CI: {appointment.patientCi}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Stethoscope className="h-3.5 w-3.5" />
                    <span>{appointment.doctorName}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" />
                    <span>
                      {format(parseISO(appointment.date), "d MMM", { locale: es })} a las{" "}
                      {appointment.startTime}
                    </span>
                  </div>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  {specialtyLabels[appointment.specialty]}
                </p>
              </div>
              <div className="flex flex-col items-end gap-2">
                <StatusBadge status={appointment.status} />
                {appointment.status === "solicitada" && (
                  <div className="flex gap-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-7 text-xs text-primary hover:text-primary hover:bg-primary/10"
                      onClick={() => updateAppointmentStatus(appointment.id, "confirmada")}
                    >
                      Confirmar
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-7 text-xs text-destructive hover:text-destructive hover:bg-destructive/10"
                      onClick={() => updateAppointmentStatus(appointment.id, "cancelada")}
                    >
                      Cancelar
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
