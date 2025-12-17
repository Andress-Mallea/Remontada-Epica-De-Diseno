// src/services/appointmentService.ts
import { Appointment } from '@/types/clinic';
export interface CreateAppointmentRequest {
  requesterCi: string;
  patientCi: string;
  medicCi: string;
  fecha: string; // Se envía como string en formato ISO: "YYYY-MM-DDTHH:mm:ss"
}
const API_URL = 'http://localhost:8080/appointmentController';

export const appointmentService = {
  async getAllAppointments() {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error('Error al obtener citas');
    return response.json();
  },

  // CAMBIO: Reemplazamos 'any' por nuestra nueva interfaz
  async create(data: CreateAppointmentRequest): Promise<string> {
    const response = await fetch(`${API_URL}/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || 'Error al crear la cita');
    }

    return response.text();
  }
};