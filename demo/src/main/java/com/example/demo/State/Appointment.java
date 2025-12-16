package com.example.demo.State;

import java.time.LocalDateTime;

import com.example.demo.Model.Medic;
import com.example.demo.Model.Patient;
import com.example.demo.Observer.IObserverNotify;
import com.example.demo.State.States.RequestState;

import java.util.ArrayList;
import java.util.List;
public class Appointment {
    private static String ID = "1000";
    private Patient Patient;
    private Medic Medic;
    private LocalDateTime DateHour;
    private RegisterAppointment RegisterAppointment;
    private AppointmentState State;

    private List<IObserverNotify> Subscribers = new ArrayList<>();
    public Appointment(Patient Patient, Medic Medic, LocalDateTime DateHour) {
        this.ID = String.valueOf((Integer.parseInt(ID) + 1));
        this.Patient = Patient;
        this.Medic = Medic;
        this.DateHour = DateHour;
        this.RegisterAppointment = new RegisterAppointment();
        this.State = new RequestState();
        this.State.setState(StateAppointment.REQUESTED);
        this.State.setContext(this);
    }
    public String getID() {
        return ID;
    }

    public void setID(String ID) {
        this.ID = ID;
    }

    public Patient getPatient() {
        return Patient;
    }

    public void setPatient(Patient patient) {
        if (patient != null) {
            Subscribers.add(patient);
        }
        this.Patient = patient;
    }

    public Medic getMedic() {
        return Medic;
    }

    public void setMedic(Medic medic) {
        if (medic != null) {
            Subscribers.add(medic);
        }
        this.Medic = medic;
    }

    public LocalDateTime getDateHour() {
        return DateHour;
    }

    public void setDateHour(LocalDateTime dateHour) {
        this.DateHour = dateHour;
    }

    public RegisterAppointment getRegisterAppointment() {
        return RegisterAppointment;
    }

    public List<IObserverNotify> getSubscribers() { return Subscribers; }
    public void setSubscribers(List<IObserverNotify> subscribers) { Subscribers = subscribers; }


    public void setRegisterAppointment(RegisterAppointment registerAppointment) {
        this.RegisterAppointment = registerAppointment;
    }

    public AppointmentState getEstate() {
        return State;
    }

    public void setEstate(AppointmentState estate) {
        this.State = estate;
    }

    public void Confirm(){
        if(this.State == null) {
            AppointmentState s = new RequestState();
            s.setContext(this);
            this.State = s;
        }
        this.State.setContext(this);
        this.State.Confirm();

        NotifySubscribers("Cita confirmada");
    }
    public void Cancel(){
         if(this.State == null) {
            AppointmentState s = new RequestState();
            s.setContext(this);
            this.State = s;
        }
        this.State.setContext(this);
        this.State.Cancel();

        NotifySubscribers("Cita cancelada");
    }
    public void Attend(){
         if(this.State == null) {
            AppointmentState s = new RequestState();
            s.setContext(this);
            this.State = s;
        }
        this.State.setContext(this);
        this.State.Attend();

        NotifySubscribers("Cita attendida");
    }

    public void NotifySubscribers(String message) {
        for (IObserverNotify obs : Subscribers) {
            obs.Notify(message);
        }
    }
}

    