package com.example.demo.Model;

import java.util.HashMap;
import java.util.Map;

import com.example.demo.State.Appointment;

public class Shedule {
    private Map<Integer, Appointment>[] Agenda;
    public Shedule() {
        this.Agenda = new HashMap[5];
        for(int i = 0 ; i < 5 ; ++i) {
            Agenda[i] = new HashMap<>();
        }
    }
    public boolean isAvaible(int day, int hour) {
        if(day< 0 || day >4) throw new IllegalArgumentException("Dia Invalido");
        return !Agenda[day].containsKey(hour);
    }
    public void addAppointment(int day, int hour, Appointment appointment) {
        if(!isAvaible(day,hour)) throw new IllegalStateException("El horario ya esta ocupado");
        Agenda[day].put(hour,appointment);
    }

    public void removeAppoiment(int day, int hour) {
        if(day< 0 || day >4) throw new IllegalArgumentException("Dia Invalido");
        if(Agenda[day].containsKey(hour)) {
            Agenda[day].remove(hour);
        }
    }

    public Map<Integer, Appointment>[] getAgenda() {
        return Agenda;
    }
    public java.util.List<Appointment> getAllAppointments() { 
    java.util.List<Appointment> all = new java.util.ArrayList<>();
    for (int i = 0; i < 5; i++) {
        if (Agenda[i] != null) {
            all.addAll(Agenda[i].values());
        }
    }
    return all;
}
    
}
