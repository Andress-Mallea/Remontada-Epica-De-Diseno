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
    public void Request(){
        throw new IllegalStateException("Error 01: Accion Invalida");
    };
    @Override
    public void Cancel(){
        throw new IllegalStateException("Error 01: Accion Invalida");
    };
    @Override
    public void Confirm(){
        throw new IllegalStateException("Error 01: Accion Invalida");
    };
    @Override
    public void Attend(){
        throw new IllegalStateException("Error 01: Accion Invalida");
    };
}
