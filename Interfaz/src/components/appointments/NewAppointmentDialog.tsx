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
import { useAuth } from "@/context/AuthContext";
import { doctors, timeSlots, patients } from "@/data/mockData";
import { specialtyLabels, Specialty } from "@/types/clinic";
import { toast } from "sonner";
import { userService, BackendDoctor  } from "@/services/userService";
export function NewAppointmentDialog() {
  const { user, hasRole } = useAuth();
  const [open, setOpen] = useState(false);
  const [ci, setCi] = useState("");
  const [patientFound, setPatientFound] = useState<{id: string, name: string, email: string, phone?: string, ci?: string} | null>(null);
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedTime, setSelectedTime] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState<Specialty | "">("");

  const { addAppointment, appointments } = useAppointments();
  const [backendDoctors, setBackendDoctors] = useState<BackendDoctor[]>([]);
  useEffect(() => {
    if (hasRole('paciente') && user) {
      setPatientFound({
        id: user.id,
        name: user.name,
        email: user.email,
        ci: user.CI,
      });
    } else {
      setPatientFound(null);
    }
  }, [user, hasRole, open]);
  useEffect(() => {
  const loadDoctors = async () => {
  try {
    // data recibirá el array de médicos con su specialty
    const data = await userService.getMedics(); 
    setBackendDoctors(data);
  } catch (error) {
    console.error("Error cargando médicos:", error);
  }
};
  if (open) loadDoctors();
}, [open]);

const searchPatient = async () => {
  if (!ci) {
    toast.error("Por favor, ingrese un CI");
    return;
  }

  try {
    const response = await userService.searchByCi(ci);
    console.log("OBJETO PACIENTE REAL:", response);

    if (response) {
      // USAMOS LAS MAYÚSCULAS QUE VIMOS EN EL LOG
      const patientName = response.Name || "Sin nombre";
      
      setPatientFound({
        id: response.CI,    // Antes era .id o .ci
        name: patientName,  // Mapeamos 'Name' a nuestra propiedad 'name'
        email: response.Email || "",
        ci: response.CI,
      });
      
      toast.success(`Paciente encontrado: ${patientName}`);
    }
  } catch (error) {
    setPatientFound(null);
    toast.error("Error al buscar el paciente");
  }
};
  const filteredDoctors = selectedSpecialty
  ? backendDoctors.filter((d) => {
      // Función para quitar tildes y pasar a minúsculas
      const normalize = (str: string) => 
        str ? str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim() : "";
      
      // Comparamos "cardiologia" (backend) con "cardiologia" (interfaz)
      return normalize(d.specialty) === normalize(selectedSpecialty);
    })
  : backendDoctors;
  const getAvailableSlots = () => {
    if (!selectedDoctor || !selectedDate) return timeSlots;
    const dateStr = format(selectedDate, "yyyy-MM-dd");
    const bookedSlots = appointments
      .filter((apt) => apt.doctorId === selectedDoctor && apt.date === dateStr && apt.status !== "cancelada")
      .map((apt) => apt.startTime);
    return timeSlots.filter((slot) => !bookedSlots.includes(slot));
  };
console.log("Usuario logueado actual:", user);
  const handleSubmit = async () => {
  if (!patientFound || !selectedDoctor || !selectedDate || !selectedTime || !user) {
    toast.error("Complete todos los campos requeridos");
    return;
  }

  // selectedDoctor contiene el valor de 'value' del SelectItem (que es doctor.ci)
  const isoFecha = `${format(selectedDate, "yyyy-MM-dd")}T${selectedTime}:00`;

  const appointmentRequest = {
    requesterCi: user.CI,      // CI del que está logueado
    patientCi: patientFound.ci, // CI del paciente encontrado con la lupa
    medicCi: selectedDoctor,    // <--- ¡IMPORTANTE! Debe ser la CI del médico
    fecha: isoFecha,
  };
console.log("DATOS ENVIADOS AL BACKEND:", appointmentRequest);
    try {
      // addAppointment en el Contexto ahora debe ser async y llamar al servicio
      await addAppointment(appointmentRequest);
      
      if (!hasRole('PATIENT')) {
        setCi("");
        setPatientFound(null);
      }
      
      setSelectedDoctor("");
      setSelectedDate(undefined);
      setSelectedTime("");
      setSelectedSpecialty("");
      setOpen(false);
    } catch (error) {
      // Manejo de error silencioso (el Contexto ya dispara el toast)
    }
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
                  {/* Antes podía decir patientFound.nombre, cámbialo a .name */}
                  <p className="font-medium text-accent-foreground">{patientFound.name}</p>
                  <p className="text-sm text-muted-foreground">{patientFound.email}</p>
                </div>
              )}
            </div>
          )}

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

          <div className="space-y-2">
            <Label>Médico</Label>
            <Select value={selectedDoctor} onValueChange={setSelectedDoctor}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccione médico" />
              </SelectTrigger>
              <SelectContent>
                {filteredDoctors.map((doctor) => {
                  console.log("Dibujando doctor:", doctor); // Mira esto en la consola al abrir el select
                  return (
                    <SelectItem key={doctor.ci} value={doctor.ci}>
                      {doctor.name} - {doctor.specialty}
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>
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