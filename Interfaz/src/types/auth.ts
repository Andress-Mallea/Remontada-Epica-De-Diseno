// Tipos de autenticación preparados para backend Java con JWT

export type UserRole = 'paciente' | 'recepcion' | 'medico' | 'administrador';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  ci?: string; // Para pacientes
  specialty?: string; // Para médicos
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

// Permisos por rol
export const rolePermissions: Record<UserRole, string[]> = {
  paciente: ['view_own_appointments', 'request_appointment', 'cancel_own_appointment'],
  recepcion: ['view_all_appointments', 'create_patient', 'create_appointment', 'confirm_appointment', 'cancel_appointment', 'send_reminders'],
  medico: ['view_own_agenda', 'view_patient_history', 'register_attendance', 'close_appointment'],
  administrador: ['all_permissions', 'create_doctor', 'create_receptionist', 'manage_users', 'view_reports'],
};

export const roleLabels: Record<UserRole, string> = {
  paciente: 'Paciente',
  recepcion: 'Recepción',
  medico: 'Médico',
  administrador: 'Administrador',
};
