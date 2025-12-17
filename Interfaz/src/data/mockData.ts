import { Appointment, Doctor, Patient } from "@/types/clinic";

// 1. Definimos los pacientes
export const patients: Patient[] = [
  {
    id: "4",
    name: "Juan Pérez",
    email: "juan.perez@email.com",
    ci: "12345678",
    phone: "70012345",
  },
  {
    id: "5",
    name: "María González",
    email: "maria.gonzalez@email.com",
    ci: "87654321",
    phone: "70054321",
  },
  {
    id: "6",
    name: "Carlos Mendoza",
    email: "carlos.mendoza@email.com",
    ci: "11223344",
    phone: "70098765",
  },
];

// 2. Definimos los médicos 
// IMPORTANTE: Los IDs deben coincidir con los de authService.ts
// En authService, el médico Dr. Carlos Rodríguez tiene ID '3'
export const doctors: Doctor[] = [
  {
    id: "3", // ID corregido para coincidir con authService
    name: "Dr. Carlos Rodríguez",
    specialty: "medicina-general",
    email: "medico@clinica.com",
    role: "medico",
  },
  {
    id: "doc2", // Otro médico
    name: "Dr. Hospital",
    specialty: "pediatria",
    email: "ana.lopez@clinica.com",
    role: "medico",
  },
];

// 3. Definimos las citas de prueba
const today = new Date().toISOString().split("T")[0]; // Fecha de hoy
const tomorrow = new Date(Date.now() + 86400000).toISOString().split("T")[0]; // Mañana

export const initialAppointments: Appointment[] = [
  // Cita 1: CONFIRMADA para HOY (Para Dr. Carlos - ID '3')
  {
    id: "apt1",
    patientId: "4",
    patientName: "Juan Pérez",
    patientCi: "12345678",
    doctorId: "3", // Asignada a Carlos Rodríguez (ID 3)
    doctorName: "Dr. Carlos Rodríguez",
    specialty: "cardiologia",
    date: today,
    startTime: "09:00",
    endTime: "09:30",
    status: "confirmada",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  // Cita 2: SOLICITADA para HOY (Para Dr. Carlos - ID '3')
  {
    id: "apt2",
    patientId: "5",
    patientName: "María González",
    patientCi: "87654321",
    doctorId: "3", // Asignada a Carlos Rodríguez (ID 3)
    doctorName: "Dr. Carlos Rodríguez",
    specialty: "medicina-general",
    date: today,
    startTime: "10:00",
    endTime: "10:30",
    status: "solicitada",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  // Cita 3: ATENDIDA (Para Dr. Carlos - ID '3')
  {
    id: "apt3",
    patientId: "6",
    patientName: "Carlos Mendoza",
    patientCi: "11223344",
    doctorId: "3", // Asignada a Carlos Rodríguez (ID 3)
    doctorName: "Dr. Carlos Rodríguez",
    specialty: "medicina-general",
    date: today,
    startTime: "11:00",
    endTime: "11:30",
    status: "atendida",
    reason: "Dolor de cabeza persistente",
    diagnosis: "Cefalea tensional leve",
    notes: "Se recetó paracetamol cada 8 horas.",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  // Cita 4: OTRO MÉDICO (No debería aparecer en tu agenda)
  {
    id: "apt4",
    patientId: "4",
    patientName: "Juan Pérez",
    patientCi: "12345678",
    doctorId: "doc2", // Dra. Ana López
    doctorName: "Dra. Ana López",
    specialty: "pediatria",
    date: today,
    startTime: "09:00",
    endTime: "09:30",
    status: "confirmada",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  // Cita 5: MAÑANA (Para Dr. Carlos - ID '3')
  {
    id: "apt5",
    patientId: "5",
    patientName: "María González",
    patientCi: "87654321",
    doctorId: "3", // Asignada a Carlos Rodríguez (ID 3)
    doctorName: "Dr. Carlos Rodríguez",
    specialty: "medicina-general",
    date: tomorrow,
    startTime: "15:00",
    endTime: "15:30",
    status: "confirmada",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export const timeSlots = [
  "08:00", "09:00", "10:00",  
  "11:00", "14:00", "15:00", 
  "16:00", "17:00"
];