package com.example.demo.Services;

import com.example.demo.Dtos.AppointmentDto;
import com.example.demo.Dtos.RequestAppointmentDto;
import com.example.demo.Model.*;
import com.example.demo.Repository.AppointmentRepository;
import com.example.demo.Repository.UserRepository;
import com.example.demo.State.Appointment;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

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

        LocalDateTime fechaCita = data.getFecha();
        int diaSemana = fechaCita.getDayOfWeek().getValue();
        int indexAgenda = diaSemana - 1;
        if(indexAgenda < 0 || indexAgenda > 4) {
            throw new IllegalArgumentException("La clinica solo atiende de lunes a viernes");
        }
        int horaCita = fechaCita.getHour();

        if(!medic.getAgenda().isAvaible(indexAgenda, horaCita)) {
            throw new IllegalStateException("Horario Ocupado");
        }
        Patient patient = (Patient) userPatient;
        Appointment newAppointment = new Appointment(patient, medic, data.getFecha());
        medic.getAgenda().addAppointment(indexAgenda, horaCita, newAppointment);
        appointmentRepository.save(newAppointment);
        return "Cita creada exitosamente";
    }
    public List<AppointmentDto> getAllAppoinments() {
        List<Appointment> entities = appointmentRepository.getAllAppointments();
        return entities.stream().map(AppointmentDto::fromEntity).collect(Collectors.toList());
    }
    public void confirmAppointment(String appointmentId, String userCi) {
        User user = userRepository.findByCi(userCi);
        if(user == null) throw new RuntimeException("Usuario no encontrado");
        Appointment appointment = appointmentRepository.findById(appointmentId);
        if(appointment == null) throw new RuntimeException("Cita no encontrada");
        if(user.getRole() == Role.RECEPTIONIST) {
            appointment.Confirm();
        }
        else {
            throw new SecurityException("Solo recepcionista puede confirmar citas");
        }
    }
    public void cancelAppoint(String appointmentId, String userCi) {
        User user = userRepository.findByCi(userCi);
        if(user == null) throw new RuntimeException("Usuario no encontrado");
        Appointment appointment = appointmentRepository.findById(appointmentId);
        if(appointment == null) throw new RuntimeException("Cita no encontrada");
        boolean isReceptionist = user.getRole() == Role.RECEPTIONIST;
        boolean isOwnerPatient = user.getRole() == Role.PATIENT && appointment.getPatient().getCI().equals(user.getCI());
        if(isReceptionist || isOwnerPatient) {
            appointment.Cancel();
        }
        else {
            throw new SecurityException("No tiene permisos para cancelar esta cita.");
        }
    }
}
