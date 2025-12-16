package com.example.demo.State;

import java.time.LocalDateTime;

import com.example.demo.Model.Medic;
import com.example.demo.Model.Patient;
import com.example.demo.Observer.IObserverNotify;
import com.example.demo.State.States.RequestState;
import java.util.List;
public class Appointment {
    private String ID;
    private Patient Patient;
    private Medic Medic;
    private LocalDateTime DateHour;
    private RegisterAppointment RegisterAppointment;
    private AppointmentState State;

    private List<IObserverNotify> Subscribers;
    
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
        this.Patient = patient;
    }

    public Medic getMedic() {
        return Medic;
    }

    public void setMedic(Medic medic) {
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
    }
    public void Cancel(){
         if(this.State == null) {
            AppointmentState s = new RequestState();
            s.setContext(this);
            this.State = s;
        }
        this.State.setContext(this);
        this.State.Cancel();
    }
    public void Attend(){
         if(this.State == null) {
            AppointmentState s = new RequestState();
            s.setContext(this);
            this.State = s;
        }
        this.State.setContext(this);
        this.State.Attend();
    }
}

    