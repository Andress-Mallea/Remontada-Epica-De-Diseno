export type AppointmentStatus = 'solicitada' | 'confirmada' | 'cancelada' | 'atendida';

export type UserRole = 'paciente' | 'recepcion' | 'medico' | 'administrador';

export type Specialty = 
  | 'medicina-general'
  | 'pediatria'
  | 'cardiologia'
  | 'dermatologia'
  | 'ginecologia'
  | 'traumatologia'
  | 'oftalmologia'
  | 'neurologia';

export const specialtyLabels: Record<Specialty, string> = {
  'medicina-general': 'Medicina General',
  'pediatria': 'Pediatría',
  'cardiologia': 'Cardiología',
  'dermatologia': 'Dermatología',
  'ginecologia': 'Ginecología',
  'traumatologia': 'Traumatología',
  'oftalmologia': 'Oftalmología',
  'neurologia': 'Neurología',
};

export const statusLabels: Record<AppointmentStatus, string> = {
  'solicitada': 'Solicitada',
  'confirmada': 'Confirmada',
  'cancelada': 'Cancelada',
  'atendida': 'Atendida',
};

export const statusColors: Record<AppointmentStatus, string> = {
  'solicitada': 'warning',
  'confirmada': 'primary',
  'cancelada': 'destructive',
  'atendida': 'success',
};

export interface Doctor {
  id: string;
  name: string;
  specialty: Specialty;
  availableSlots: TimeSlot[];
}

export interface TimeSlot {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
}

export interface Patient {
  id: string;
  ci: string;
  name: string;
  email: string;
  phone: string;
}

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  patientCi: string;
  doctorId: string;
  doctorName: string;
  specialty: Specialty;
  date: string;
  startTime: string;
  endTime: string;
  status: AppointmentStatus;
  reason?: string;
  diagnosis?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AttendanceRecord {
  appointmentId: string;
  reason: string;
  diagnosis: string;
  notes?: string;
  attendedAt: string;
}
