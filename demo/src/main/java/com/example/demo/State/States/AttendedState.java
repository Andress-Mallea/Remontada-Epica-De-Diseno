package com.example.demo.State.States;

import com.example.demo.State.AppointmentState;
import com.example.demo.State.StateAppointment;

public class AttendedState extends AppointmentState {

	@Override
	public void Request() {
		throw new IllegalStateException("La cita ya fue atendida.");
	}

	@Override
	public void Attend() {
		throw new IllegalStateException("La cita ya fue atendida.");
	}

	@Override
	public void Cancel() {
		throw new IllegalStateException("No se puede cancelar una cita que ya fue atendida.");
	}

	@Override
	public void Confirm() {
		throw new IllegalStateException("No se puede confirmar una cita que ya fue atendida.");
	}
}
