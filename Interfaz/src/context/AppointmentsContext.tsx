import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Appointment, AppointmentStatus } from '@/types/clinic';
import { appointmentService, CreateAppointmentRequest } from '@/services/AppointmentService';
import { toast } from 'sonner';

interface AppointmentsContextType {
  appointments: Appointment[];
  addAppointment: (appointmentData: CreateAppointmentRequest) => Promise<void>;
  updateAppointmentStatus: (id: string, status: AppointmentStatus) => void;
  recordAttendance: (id: string, reason: string, diagnosis: string, notes?: string) => void;
  getAppointmentById: (id: string) => Appointment | undefined;
  isLoading: boolean;
}
interface BackendAppointment {
  id: number | string;
  fecha: string;        // "2025-12-25T16:00:00"
  estado: string;       // "SOLICITADA", "CONFIRMADA", etc.
  patientCi: string;
  medicCi: string;
  requesterCi: string;
  specialty: string;
}
const AppointmentsContext = createContext<AppointmentsContextType | undefined>(undefined);

export function AppointmentsProvider({ children }: { children: ReactNode }) {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadAppointments = async () => {
    try {
      setIsLoading(true);
      const data = await appointmentService.getAllAppointments();
      setAppointments(data);
    } catch (error) {
      console.error("Error al cargar citas:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
  const fetchAppointments = async () => {
  try {
    const response = await fetch('http://localhost:8080/appointmentController');
    if (!response.ok) throw new Error('Error en la red');

    const data: BackendAppointment[] = await response.json();

  const mappedAppointments: Appointment[] = data.map((app) => {
  // 1. Verificación de seguridad: Si no hay fecha, usamos una por defecto
  const fechaSegura = app.fecha || new Date().toISOString(); 
  
  // 2. Ahora el split no fallará porque garantizamos que hay un string
  const [datePart, timePart] = fechaSegura.split("T");
  const hour = timePart ? timePart.substring(0, 5) : "00:00";
  
  // 3. Normalización del estado (Enum Backend -> Frontend)
  const rawStatus = String(app.estado || "REQUESTED").toUpperCase();
  let uiStatus: AppointmentStatus = "solicitada"; 

  if (rawStatus === "CANCEL" || rawStatus === "CANCELLED") uiStatus = "cancelada";
  if (rawStatus === "CONFIRMED") uiStatus = "confirmada";
  if (rawStatus === "COMPLETED") uiStatus = "atendida";

  return {
    id: String(app.id || Math.random()),
    patientId: app.patientCi || "",
    patientName: "Paciente " + (app.patientCi || "Desconocido"),
    patientCi: app.patientCi || "",
    doctorId: app.medicCi || "",
    doctorName: "Médico " + (app.medicCi || "Asignado"),
    specialty: (app.specialty) || "General",
    date: datePart,
    startTime: hour,
    endTime: hour,
    status: uiStatus,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    reason: "",
    diagnosis: "",
    notes: ""
  } as Appointment;
});

    setAppointments(mappedAppointments);
  } catch (error) {
    console.error("Error cargando citas:", error);
  }
};
  fetchAppointments();
}, []);

  const addAppointment = async (appointmentData: CreateAppointmentRequest) => {
    try {
      await appointmentService.create(appointmentData);
      toast.success('Cita solicitada exitosamente');
      await loadAppointments();
    } catch (Error) {
      toast.error(Error.message || 'Error al solicitar la cita');
      throw Error;
    }
  };

  const updateAppointmentStatus = (id: string, status: AppointmentStatus) => {
    setAppointments((prev) =>
      prev.map((apt) =>
        apt.id === id
          ? { ...apt, status, updatedAt: new Date().toISOString() }
          : apt
      )
    );
    
    const statusMessages: Record<AppointmentStatus, string> = {
      confirmada: 'Cita confirmada',
      cancelada: 'Cita cancelada',
      atendida: 'Cita marcada como atendida',
      solicitada: 'Estado actualizado',
    };
    
    toast.success(statusMessages[status]);
  };

  const recordAttendance = (id: string, reason: string, diagnosis: string, notes?: string) => {
    setAppointments((prev) =>
      prev.map((apt) =>
        apt.id === id
          ? {
              ...apt,
              status: 'atendida' as AppointmentStatus,
              reason,
              diagnosis,
              notes,
              updatedAt: new Date().toISOString(),
            }
          : apt
      )
    );
    toast.success('Atención registrada y cita cerrada');
  };

  const getAppointmentById = (id: string) => {
    return appointments.find((apt) => apt.id === id);
  };

  return (
    <AppointmentsContext.Provider
      value={{
        appointments,
        addAppointment,
        updateAppointmentStatus,
        recordAttendance,
        getAppointmentById,
        isLoading,
      }}
    >
      {children}
    </AppointmentsContext.Provider>
  );
}

export function useAppointments() {
  const context = useContext(AppointmentsContext);
  if (context === undefined) {
    throw new Error('useAppointments must be used within an AppointmentsProvider');
  }
  return context;
}