import { format, startOfWeek, addDays, isToday } from "date-fns";
import { es } from "date-fns/locale";
import { useAppointments } from "@/context/AppointmentsContext";
import { StatusBadge } from "@/components/ui/status-badge";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext"; // 1. Importar Auth

const timeSlots = [
  "08:00", "09:00", "10:00", "11:00", "14:00", "15:00", "16:00", "17:00"
];

export function WeeklySchedule() {
  const { appointments } = useAppointments();
  // 2. Obtener usuario y rol
  const { user, hasRole } = useAuth();

  const today = new Date();
  const weekStart = startOfWeek(today, { weekStartsOn: 1 });
  
  const weekDays = Array.from({ length: 5 }, (_, i) => addDays(weekStart, i));

  const getAppointmentForSlot = (date: Date, time: string) => {
  const dateStr = format(date, "yyyy-MM-dd");
  
  return appointments.find((apt) => {
    // 1. Limpiamos el startTime del backend por si trae segundos (16:00:00 -> 16:00)
    const cleanStartTime = apt.startTime?.substring(0, 5);
    
    // 2. Comparación básica
    const isMatch = apt.date === dateStr && cleanStartTime === time && apt.status !== "cancelada";
    
    if (!isMatch) return false;

    // 3. Filtro de Seguridad por Rol (Asegúrate de que 'user.CI' coincida con 'doctorId')
    if (hasRole('medico')) {
      // Usamos CI porque es lo que estamos guardando como doctorId en el mapeo
      return apt.doctorId === user?.CI || apt.doctorId === user?.CI;
    }

    return true;
  });
};

  return (
    <div className="bg-card rounded-xl shadow-card border border-border/50 overflow-hidden animate-fade-in">
      <div className="border-b border-border p-4">
        <h3 className="text-lg font-semibold text-card-foreground">Agenda Semanal</h3>
        <p className="text-sm text-muted-foreground">
          {format(weekStart, "d 'de' MMMM", { locale: es })} -{" "}
          {format(addDays(weekStart, 4), "d 'de' MMMM yyyy", { locale: es })}
        </p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[800px]">
          <thead>
            <tr className="bg-muted/50">
              <th className="w-20 p-3 text-left text-xs font-medium text-muted-foreground">
                Hora
              </th>
              {weekDays.map((day) => (
                <th
                  key={day.toISOString()}
                  className={cn(
                    "p-3 text-center text-xs font-medium",
                    isToday(day) ? "bg-primary/10 text-primary" : "text-muted-foreground"
                  )}
                >
                  <div className="font-semibold">
                    {format(day, "EEEE", { locale: es })}
                  </div>
                  <div className={cn(
                    "mt-1 text-lg font-bold",
                    isToday(day) ? "text-primary" : "text-card-foreground"
                  )}>
                    {format(day, "d")}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {timeSlots.map((time) => (
              <tr key={time} className="divide-x divide-border">
                <td className="p-3 text-sm font-medium text-muted-foreground bg-muted/30">
                  {time}
                </td>
                {weekDays.map((day) => {
                  const appointment = getAppointmentForSlot(day, time);
                  return (
                    <td
                      key={day.toISOString()}
                      className={cn(
                        "p-2 h-20 align-top",
                        isToday(day) && "bg-primary/5"
                      )}
                    >
                      {appointment && (
                        <div className="bg-accent rounded-lg p-2 h-full">
                          <div className="flex items-start justify-between gap-1">
                            <p className="text-xs font-medium text-accent-foreground truncate">
                              {appointment.patientName}
                            </p>
                            <StatusBadge status={appointment.status} className="text-[10px] px-1.5 py-0" />
                          </div>
                          {/* Opcional: Si es médico, puede ser redundante ver su propio nombre, pero lo dejamos por consistencia */}
                          <p className="text-[10px] text-muted-foreground mt-1 truncate">
                            {appointment.doctorName}
                          </p>
                        </div>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}