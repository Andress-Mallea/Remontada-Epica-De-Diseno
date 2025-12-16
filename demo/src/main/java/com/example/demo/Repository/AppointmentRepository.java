package com.example.demo.Repository;

import com.example.demo.State.Appointment;
import com.example.demo.State.StateAppointment;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

public class AppointmentRepository {
    private List<Appointment> Appoiments = new ArrayList<>();
    public List<Appointment> getByState(StateAppointment estado) {
        List<Appointment> result = Appoiments.stream().filter(x-> x.getEstate().getState() == estado).toList();
        return result;
    }
    public List<Appointment> getByCI(String CI) {
        return Appoiments.stream().filter(x-> x.getMedic().getCI() == CI).toList();
    }
    public void save(Appointment a) {
        Appoiments.add(a);
    }
    public List<Appointment> findByState(StateAppointment state) {
        return Appoiments.stream().filter(x -> x.getEstate().getState().equals(state)).collect(Collectors.toList());
    }
}
