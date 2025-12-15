import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Plus, Search } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { useAppointments } from "@/context/AppointmentsContext";
import { useAuth } from "@/context/AuthContext"; // 1. Importar Auth
import { doctors, timeSlots, patients } from "@/data/mockData";
import { specialtyLabels, Specialty } from "@/types/clinic";
import { toast } from "sonner";

export function NewAppointmentDialog() {
  const { user, hasRole } = useAuth(); // 2. Obtener usuario
  const [open, setOpen] = useState(false);
  
  // Estado
  const [ci, setCi] = useState("");
  // Definimos el tipo explícito para patientFound
  const [patientFound, setPatientFound] = useState<{id: string, name: string, email: string, phone?: string, ci?: string} | null>(null);
  
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedTime, setSelectedTime] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState<Specialty | "">("");

  const { addAppointment, appointments } = useAppointments();

  // 3. Efecto: Si es paciente, auto-cargar sus datos al abrir
  useEffect(() => {
    if (hasRole('paciente') && user) {
      setPatientFound({
        id: user.id,
        name: user.name,
        email: user.email,
        ci: user.ci,
        phone: user.phone || "" // Asegúrate de que tu tipo User tenga phone si lo usas
      });
    } else {
      setPatientFound(null);
    }
  }, [user, hasRole, open]);

  const searchPatient = () => {
    const patient = patients.find((p) => p.ci === ci);
    if (patient) {
      setPatientFound(patient);
      toast.success(`Paciente encontrado: ${patient.name}`);
    } else {
      setPatientFound(null);
      toast.error("Paciente no encontrado. Verifique el CI.");
    }
  };

  const filteredDoctors = selectedSpecialty
    ? doctors.filter((d) => d.specialty === selectedSpecialty)
    : doctors;

  const getAvailableSlots = () => {
    if (!selectedDoctor || !selectedDate) return timeSlots;
    const dateStr = format(selectedDate, "yyyy-MM-dd");
    const bookedSlots = appointments
      .filter((apt) => apt.doctorId === selectedDoctor && apt.date === dateStr && apt.status !== "cancelada")
      .map((apt) => apt.startTime);
    return timeSlots.filter((slot) => !bookedSlots.includes(slot));
  };

  const handleSubmit = () => {
    if (!patientFound || !selectedDoctor || !selectedDate || !selectedTime) {
      toast.error("Complete todos los campos requeridos");
      return;
    }

    const doctor = doctors.find((d) => d.id === selectedDoctor);
    if (!doctor) return;

    const [hours, minutes] = selectedTime.split(":").map(Number);
    const endTime = `${String(hours).padStart(2, "0")}:${String((minutes + 30) % 60).padStart(2, "0")}`;

    addAppointment({
      patientId: patientFound.id,
      patientName: patientFound.name,
      patientCi: patientFound.ci || "",
      doctorId: doctor.id,
      doctorName: doctor.name,
      specialty: doctor.specialty,
      date: format(selectedDate, "yyyy-MM-dd"),
      startTime: selectedTime,
      endTime,
      status: "solicitada",
    });

    // Reset solo si NO es paciente (si es paciente, mantenemos sus datos)
    if (!hasRole('paciente')) {
      setCi("");
      setPatientFound(null);
    }
    
    setSelectedDoctor("");
    setSelectedDate(undefined);
    setSelectedTime("");
    setSelectedSpecialty("");
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Nueva Cita
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Solicitar Nueva Cita</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 mt-4">
          
          {/* 4. Si es paciente, solo mostramos sus datos fijos. Si no, mostramos búsqueda. */}
          {hasRole('paciente') ? (
            <div className="bg-primary/10 rounded-lg p-3 border border-primary/20">
               <p className="text-sm font-medium text-primary">Solicitando cita para:</p>
               <p className="font-bold text-foreground">{patientFound?.name}</p>
               <p className="text-xs text-muted-foreground">CI: {patientFound?.ci}</p>
            </div>
          ) : (
            <div className="space-y-2">
              <Label>Cédula de Identidad (CI)</Label>
              <div className="flex gap-2">
                <Input
                  placeholder="Ingrese el CI del paciente"
                  value={ci}
                  onChange={(e) => setCi(e.target.value)}
                />
                <Button variant="secondary" onClick={searchPatient}>
                  <Search className="h-4 w-4" />
                </Button>
              </div>
              {patientFound && (
                <div className="bg-accent/50 rounded-lg p-3 mt-2">
                  <p className="font-medium text-accent-foreground">{patientFound.name}</p>
                  <p className="text-sm text-muted-foreground">{patientFound.email}</p>
                  <p className="text-sm text-muted-foreground">{patientFound.phone}</p>
                </div>
              )}
            </div>
          )}

          {/* Specialty */}
          <div className="space-y-2">
            <Label>Especialidad</Label>
            <Select value={selectedSpecialty} onValueChange={(v) => {
              setSelectedSpecialty(v as Specialty);
              setSelectedDoctor("");
            }}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccione especialidad" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(specialtyLabels).map(([key, label]) => (
                  <SelectItem key={key} value={key}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Doctor */}
          <div className="space-y-2">
            <Label>Médico</Label>
            <Select value={selectedDoctor} onValueChange={setSelectedDoctor}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccione médico" />
              </SelectTrigger>
              <SelectContent>
                {filteredDoctors.map((doctor) => (
                  <SelectItem key={doctor.id} value={doctor.id}>
                    {doctor.name} - {specialtyLabels[doctor.specialty]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Date */}
          <div className="space-y-2">
            <Label>Fecha</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !selectedDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {selectedDate ? format(selectedDate, "PPP", { locale: es }) : "Seleccione fecha"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  disabled={(date) => date < new Date() || date.getDay() === 0 || date.getDay() === 6}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Time */}
          <div className="space-y-2">
            <Label>Hora</Label>
            <Select value={selectedTime} onValueChange={setSelectedTime}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccione hora" />
              </SelectTrigger>
              <SelectContent>
                {getAvailableSlots().map((slot) => (
                  <SelectItem key={slot} value={slot}>
                    {slot}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button onClick={handleSubmit} className="w-full" disabled={!patientFound}>
            Solicitar Cita
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}