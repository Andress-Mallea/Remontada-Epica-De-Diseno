import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { format, startOfWeek, addDays, isToday, addWeeks, subWeeks } from "date-fns";
import { es } from "date-fns/locale";
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAppointments } from "@/context/AppointmentsContext";
import { useAuth } from "@/context/AuthContext";
import { doctors, timeSlots } from "@/data/mockData";
import { specialtyLabels, Specialty } from "@/types/clinic";
import { StatusBadge } from "@/components/ui/status-badge";
import { NewAppointmentDialog } from "@/components/appointments/NewAppointmentDialog";
import { cn } from "@/lib/utils";

export default function Agenda() {
  const { appointments } = useAppointments();
  const { user, hasRole } = useAuth();
  
  const [currentWeek, setCurrentWeek] = useState(new Date());
  
  const isDoctor = hasRole('MEDIC');
  const isPatient = hasRole('PATIENT');

  const [selectedSpecialty, setSelectedSpecialty] = useState<Specialty | "all">(
    isDoctor && user?.specialty ? (user.specialty as Specialty) : "all"
  );

  const [selectedDoctor, setSelectedDoctor] = useState<string>(
    isDoctor && user?.id ? user.id : "all"
  );
  
  const weekStart = startOfWeek(currentWeek, { weekStartsOn: 1 });
  const weekDays = Array.from({ length: 6 }, (_, i) => addDays(weekStart, i));

  const filteredDoctors = selectedSpecialty === "all"
    ? doctors
    : doctors.filter((d) => d.specialty === selectedSpecialty);

  const getAppointmentsForSlot = (date: Date, time: string) => {
    const dateStr = format(date, "yyyy-MM-dd");
    return appointments.filter((apt) => {
      const matchesDate = apt.date === dateStr && apt.startTime === time;
      
      let matchesRole = true;

      if (isDoctor) {
        matchesRole = apt.doctorId === user?.id;
      } else if (isPatient) {
        matchesRole = apt.patientId === user?.id;
      } else {
        matchesRole = selectedDoctor === "all" || apt.doctorId === selectedDoctor;
      }

      const matchesSpecialty = selectedSpecialty === "all" || apt.specialty === selectedSpecialty;
      
      return matchesDate && matchesRole && matchesSpecialty && apt.status !== "cancelada";
    });
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Agenda Médica</h1>
            <p className="text-muted-foreground">
              {isPatient 
                ? "Consulta tus citas programadas en el calendario" 
                : "Vista semanal de citas por médico y especialidad"}
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
             {/* CAMBIO: Ocultar botón si es médico */}
             {!isDoctor && <NewAppointmentDialog />}

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setCurrentWeek(subWeeks(currentWeek, 1))}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                onClick={() => setCurrentWeek(new Date())}
                className="gap-2"
              >
                <Calendar className="h-4 w-4" />
                Hoy
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setCurrentWeek(addWeeks(currentWeek, 1))}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-card rounded-xl p-4 shadow-card border border-border/50">
          <div className="flex flex-col sm:flex-row gap-4">
            <Select
              value={selectedSpecialty}
              onValueChange={(v) => {
                setSelectedSpecialty(v as Specialty | "all");
                if (!isDoctor) setSelectedDoctor("all");
              }}
              disabled={isDoctor} 
            >
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue placeholder="Especialidad" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las especialidades</SelectItem>
                {Object.entries(specialtyLabels).map(([key, label]) => (
                  <SelectItem key={key} value={key}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select 
              value={isDoctor && user?.id ? user.id : selectedDoctor} 
              onValueChange={setSelectedDoctor}
              disabled={isDoctor}
            >
              <SelectTrigger className="w-full sm:w-[250px]">
                <SelectValue placeholder="Médico" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los médicos</SelectItem>
                {filteredDoctors.map((doctor) => (
                  <SelectItem key={doctor.id} value={doctor.id}>
                    {doctor.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Week Header */}
        <div className="text-center">
          <h2 className="text-lg font-semibold text-foreground">
            {format(weekStart, "d 'de' MMMM", { locale: es })} -{" "}
            {format(addDays(weekStart, 5), "d 'de' MMMM, yyyy", { locale: es })}
          </h2>
        </div>

        {/* Schedule Grid */}
        <div className="bg-card rounded-xl shadow-card border border-border/50 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px]">
              <thead>
                <tr className="bg-muted/50">
                  <th className="w-20 p-3 text-left text-xs font-medium text-muted-foreground border-r border-border">
                    Hora
                  </th>
                  {weekDays.map((day) => (
                    <th
                      key={day.toISOString()}
                      className={cn(
                        "p-3 text-center border-r border-border last:border-r-0",
                        isToday(day) && "bg-primary/10"
                      )}
                    >
                      <div className="text-xs font-medium text-muted-foreground">
                        {format(day, "EEEE", { locale: es })}
                      </div>
                      <div
                        className={cn(
                          "mt-1 text-xl font-bold",
                          isToday(day) ? "text-primary" : "text-card-foreground"
                        )}
                      >
                        {format(day, "d")}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {timeSlots.map((time) => (
                  <tr key={time}>
                    <td className="p-2 text-sm font-medium text-muted-foreground bg-muted/30 border-r border-border">
                      {time}
                    </td>
                    {weekDays.map((day) => {
                      const slotAppointments = getAppointmentsForSlot(day, time);
                      return (
                        <td
                          key={day.toISOString()}
                          className={cn(
                            "p-1 h-24 align-top border-r border-border last:border-r-0",
                            isToday(day) && "bg-primary/5"
                          )}
                        >
                          <div className="space-y-1">
                            {slotAppointments.map((apt) => (
                              <div
                                key={apt.id}
                                className="bg-accent rounded-lg p-2 cursor-pointer hover:shadow-md transition-shadow"
                              >
                                <div className="flex items-start justify-between gap-1 mb-1">
                                  {/* Si es paciente, mostramos la fecha o doctor en lugar de su propio nombre */}
                                  <p className="text-xs font-medium text-accent-foreground truncate">
                                    {isPatient ? apt.doctorName : apt.patientName}
                                  </p>
                                </div>
                                {!isDoctor && !isPatient && (
                                  <p className="text-[10px] text-muted-foreground truncate">
                                    {apt.doctorName}
                                  </p>
                                )}
                                <StatusBadge
                                  status={apt.status}
                                  className="mt-1 text-[9px] px-1.5 py-0"
                                />
                              </div>
                            ))}
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}