package com.example.demo.State.States;

import com.example.demo.State.AppointmentState;
import com.example.demo.State.StateAppointment;

public class RequestState extends AppointmentState {

	@Override
	public void Attend() {
		throw new IllegalStateException("No se puede asistir a una cita que no ha sido confirmada.");
	}

	@Override
	public void Cancel() {
		CanceledState s = new CanceledState();
		s.setContext(this.context);
		s.setState(StateAppointment.CANCELED);
		this.context.setEstate(s);
	}

	@Override
	public void Request() {
		throw new IllegalStateException("La cita ya está en estado 'REQUESTED'.");
	}

	@Override
	public void Confirm() {
		getContext().addToMedicAgenda();
		ConfirmedState s = new ConfirmedState();
		s.setContext(this.context);
		s.setState(StateAppointment.CONFIRMED);
		this.context.setEstate(s);
	}
}
