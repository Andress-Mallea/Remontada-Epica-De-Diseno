package com.example.demo.State;

public abstract class AppointmentState implements  PatternStateAppointment{
    private StateAppointment State;
    protected Appointment context;

    public void setContext(Appointment appointment) {
        this.context = appointment;
    }

    public Appointment getContext() {
        return this.context;
    }

    public StateAppointment getState() {
        return State;
    }

    public void setState(StateAppointment state) {
        this.State = state;
    }
    @Override
    public abstract void Request();
    @Override
    public abstract void Cancel();
    @Override
    public abstract void Confirm();
    @Override
    public abstract void Attend();
}
