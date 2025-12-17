// Interfaz/src/types/auth.ts

// Actualizamos UserRole para que acepte tanto el formato del mock como el de Java
export type UserRole = 
  | 'paciente' | 'recepcion' | 'medico' | 'administrador'
  | 'PATIENT'  | 'RECEPTIONIST' | 'MEDIC'  | 'ADMINISTRATOR';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  ci?: string; 
  specialty?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  refreshToken?: string;
}

export interface LoginCredentials {
  ci: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
  role: UserRole;
  ci?: string;
  specialty?: string;
  phone?: string;
}

// Mapeamos los permisos también para los roles en mayúsculas
export const rolePermissions: Record<UserRole, string[]> = {
  paciente: ['view_own_appointments', 'request_appointment', 'cancel_own_appointment'],
  PATIENT: ['view_own_appointments', 'request_appointment', 'cancel_own_appointment'],
  
  recepcion: ['view_all_appointments', 'create_patient', 'create_appointment', 'confirm_appointment', 'cancel_appointment', 'send_reminders'],
  RECEPTIONIST: ['view_all_appointments', 'create_patient', 'create_appointment', 'confirm_appointment', 'cancel_appointment', 'send_reminders'],
  
  medico: ['view_own_agenda', 'view_patient_history', 'register_attendance', 'close_appointment'],
  MEDIC: ['view_own_agenda', 'view_patient_history', 'register_attendance', 'close_appointment'],
  
  administrador: ['all_permissions', 'create_doctor', 'create_receptionist', 'manage_users', 'view_reports'],
  ADMINISTRATOR: ['all_permissions', 'create_doctor', 'create_receptionist', 'manage_users', 'view_reports'],
};

export const roleLabels: Record<UserRole, string> = {
  ADMINISTRATOR: 'Administrador',
  RECEPTIONIST: 'Recepción',
  MEDIC: 'Médico',
  PATIENT: 'Paciente',
  administrador: 'Administrador', // Mantenemos estos por si acaso
  recepcion: 'Recepción',
  medico: 'Médico',
  paciente: 'Paciente',
};