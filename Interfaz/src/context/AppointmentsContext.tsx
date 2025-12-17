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
    loadAppointments();
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