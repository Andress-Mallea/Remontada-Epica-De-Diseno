package com.example.demo.Services;

import com.example.demo.Dtos.RequestAppointmentDto;
import com.example.demo.Model.*;
import com.example.demo.Repository.AppointmentRepository;
import com.example.demo.Repository.UserRepository;
import com.example.demo.State.Appointment;
import org.springframework.stereotype.Service;

@Service
public class AppointmentService {
    private final UserRepository userRepository;
    private final AppointmentRepository appointmentRepository;
    public AppointmentService(UserRepository userRepository, AppointmentRepository appointmentRepository) {
        this.userRepository = userRepository;
        this.appointmentRepository = appointmentRepository;
    }
    public String createAppointment(RequestAppointmentDto data) {
        User requester = userRepository.findByCi(data.getRequesterCi());
        if(requester == null) throw new RuntimeException("Usuario no encontrado");
        if(requester.getRole() != Role.PATIENT && requester.getRole() != Role.RECEPTIONIST) {
            throw new SecurityException("Usuario no autorizado para esta tarea");
        }
        User userMedic = userRepository.findByCi(data.getMedicCi());
        if(userMedic == null || userMedic.getRole() != Role.MEDIC) {
            throw new RuntimeException("Medico no encontrado");
        }
        User userPatient = userRepository.findByCi(data.getPatientCi());
        if(userPatient == null || userPatient.getRole() != Role.PATIENT) {
            throw new RuntimeException("Paciente no encontrado");
        }
        Medic medic = (Medic) userMedic;
        if(!medic.getAgenda().isAvaible(data.getDay(), data.getHour())) {
            throw new IllegalStateException("Horario Ocupado");
        }
        Patient patient = (Patient) userPatient;
        Appointment newAppointment = new Appointment(patient, medic, data.getFecha());
        medic.getAgenda().addAppointment(data.getDay(), data.getHour(), newAppointment);
        appointmentRepository.save(newAppointment);
        return "Cita creada exitosamente";
    }
}
