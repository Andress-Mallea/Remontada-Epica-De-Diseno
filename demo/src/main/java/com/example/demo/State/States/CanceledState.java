package com.example.demo.State.States;

import com.example.demo.State.AppointmentState;

public class CanceledState extends AppointmentState {

	@Override
	public void Attend() {
		throw new IllegalStateException("No se puede asistir a una cita cancelada.");
	}

	@Override
	public void Cancel() {
		throw new IllegalStateException("La cita ya está cancelada.");
	}

	@Override
	public void Request() {
		throw new IllegalStateException("No se puede solicitar una cita que está cancelada.");
	}

	@Override
	public void Confirm() {
		throw new IllegalStateException("No se puede confirmar una cita cancelada.");
	}
}
