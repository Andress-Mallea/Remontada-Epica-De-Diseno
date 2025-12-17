package com.example.demo.State.States;

import com.example.demo.State.AppointmentState;
import com.example.demo.State.StateAppointment;
import java.time.LocalDateTime;
import com.example.demo.State.RegisterAppointment;

public class ConfirmedState extends AppointmentState {

	@Override
	public void Attend() {
		// When attending a confirmed appointment, set close hour and move to attended state
		RegisterAppointment reg = this.context.getRegisterAppointment();
		if(reg == null) {
			reg = new RegisterAppointment();
			this.context.setRegisterAppointment(reg);
		}
		reg.setCloseHour(LocalDateTime.now());
		AttendedState s = new AttendedState();
		s.setContext(this.context);
		s.setState(StateAppointment.ATTENDED);
		this.context.setEstate(s);
	}

	@Override
	public void Cancel() {
		getContext().removeFromMedicAgenda();
		CanceledState s = new CanceledState();
		s.setContext(this.context);
		s.setState(StateAppointment.CANCELED);
		this.context.setEstate(s);
	}

	@Override
	public void Request() {
		throw new IllegalStateException("No se puede solicitar una cita que ya está confirmada.");
	}

	@Override
	public void Confirm() {
		throw new IllegalStateException("La cita ya está confirmada.");
	}
}
