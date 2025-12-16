package com.example.demo.State;

import java.time.LocalDateTime;

import com.example.demo.Model.Medic;
import com.example.demo.Model.Patient;
public class Appointment {
    private String ID;
    private Patient Patient;
    private Medic Medic;
    private LocalDateTime DateHour;
    private RegisterAppointment RegisterAppointment;
    private AppointmentState State;
    
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
        //A implementar
    }
    public void Cancel(){
         //A implementar
    }
    public void Attend(){
         //A implementar
    }
}

    