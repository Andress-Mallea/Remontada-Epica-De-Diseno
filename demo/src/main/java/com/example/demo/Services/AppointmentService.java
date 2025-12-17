package com.example.demo.Services;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.example.demo.Dtos.AppointmentDto;
import com.example.demo.Dtos.RequestAppointmentDto;
import com.example.demo.Model.Medic;
import com.example.demo.Model.Patient;
import com.example.demo.Model.Role;
import com.example.demo.Model.User;
import com.example.demo.Repository.AppointmentRepository;
import com.example.demo.Repository.UserRepository;
import com.example.demo.State.Appointment;

@Service
public class AppointmentService {
    private final UserRepository userRepository;
    private final AppointmentRepository appointmentRepository;
    public AppointmentService(UserRepository userRepository, AppointmentRepository appointmentRepository) {
        this.userRepository = userRepository;
        this.appointmentRepository = appointmentRepository;
    }
    public String createAppointment(RequestAppointmentDto data) {
    User requester = userRepository.findByCi(data.getRequesterCi())
            .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

    if (requester.getRole() != Role.PATIENT && requester.getRole() != Role.RECEPTIONIST) {
        throw new SecurityException("Usuario no autorizado para esta tarea");
    }

    User userMedic = userRepository.findByCi(data.getMedicCi())
            .orElseThrow(() -> new RuntimeException("Medico no encontrado"));

    if (userMedic.getRole() != Role.MEDIC) {
        throw new RuntimeException("Medico no encontrado");
    }

    User userPatient = userRepository.findByCi(data.getPatientCi())
            .orElseThrow(() -> new RuntimeException("Paciente no encontrado"));

    if (userPatient.getRole() != Role.PATIENT) {
        throw new RuntimeException("Paciente no encontrado");
    }

    Medic medic = (Medic) userMedic;
    LocalDateTime fechaCita = data.getFecha();
    int diaSemana = fechaCita.getDayOfWeek().getValue();
    int indexAgenda = diaSemana - 1;

    if (indexAgenda < 0 || indexAgenda > 4) {
        throw new IllegalArgumentException("La clinica solo atiende de lunes a viernes");
    }

    int horaCita = fechaCita.getHour();

    if (!medic.getAgenda().isAvaible(indexAgenda, horaCita)) {
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
}
