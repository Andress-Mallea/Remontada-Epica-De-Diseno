package com.example.demo.Model;

import com.example.demo.State.Appointment;

import java.util.LinkedList;
import java.util.Queue;

public class Receptionist extends User{
    private Queue<Appointment> pendingAppointments;
    public Receptionist(String CI, String Email, String Password, String Name) {
        super(CI, Email, Password, Name);
        this.pendingAppointments = new LinkedList<>();
    }
    public void addAppointmentToQueue(Appointment appointment) {
        this.pendingAppointments.offer(appointment);
    }
    public Appointment processNextAppointment() {
        return this.pendingAppointments.poll();
    }

    public Queue<Appointment> getPendingAppointments() {
        return pendingAppointments;
    }
}