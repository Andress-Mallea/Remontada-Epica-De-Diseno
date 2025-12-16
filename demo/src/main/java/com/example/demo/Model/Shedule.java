package com.example.demo.Model;

import com.example.demo.State.Appointment;

import java.util.HashMap;
import java.util.Map;

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

    public Map<Integer, Appointment>[] getAgenda() {
        return Agenda;
    }
}
