import { createContext, useContext, useState, ReactNode } from 'react';
import { Appointment, AppointmentStatus } from '@/types/clinic';
import { initialAppointments } from '@/data/mockData';
import { toast } from 'sonner';

interface AppointmentsContextType {
  appointments: Appointment[];
  addAppointment: (appointment: Omit<Appointment, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateAppointmentStatus: (id: string, status: AppointmentStatus) => void;
  recordAttendance: (id: string, reason: string, diagnosis: string, notes?: string) => void;
  getAppointmentById: (id: string) => Appointment | undefined;
}

const AppointmentsContext = createContext<AppointmentsContextType | undefined>(undefined);

export function AppointmentsProvider({ children }: { children: ReactNode }) {
  const [appointments, setAppointments] = useState<Appointment[]>(initialAppointments);

  const addAppointment = (appointmentData: Omit<Appointment, 'id' | 'createdAt' | 'updatedAt'>) => {
    // Check for doctor conflicts
    const hasConflict = appointments.some(
      (apt) =>
        apt.doctorId === appointmentData.doctorId &&
        apt.date === appointmentData.date &&
        apt.startTime === appointmentData.startTime &&
        apt.status !== 'cancelada'
    );

    if (hasConflict) {
      toast.error('El médico ya tiene una cita en ese horario');
      return;
    }

    const newAppointment: Appointment = {
      ...appointmentData,
      id: `a${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setAppointments((prev) => [...prev, newAppointment]);
    toast.success('Cita solicitada exitosamente');
    
    // Simulate reminder notification
    setTimeout(() => {
      toast.info(`📧 Recordatorio enviado a ${appointmentData.patientName} para su cita del ${appointmentData.date}`);
    }, 1500);
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
