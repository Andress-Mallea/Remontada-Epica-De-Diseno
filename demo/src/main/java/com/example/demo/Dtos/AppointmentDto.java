package com.example.demo.Dtos;

import com.example.demo.State.Appointment;

import java.time.LocalDateTime;

public class AppointmentDto {
    private String id;
    private String patientName;
    private String patientCi;
    private String medicName;
    private String medicSpecialty;
    private LocalDateTime date;
    private String status;

    public AppointmentDto() {}

    public static AppointmentDto fromEntity(Appointment appointment) {
        AppointmentDto dto = new AppointmentDto();

        dto.setId(appointment.getID());
        dto.setDate(appointment.getDateHour());
        dto.setPatientName(appointment.getPatient().getName());
        dto.setPatientCi(appointment.getPatient().getCI());

        dto.setMedicName(appointment.getMedic().getName());
        dto.setMedicSpecialty(appointment.getMedic().getSpecialty());

        dto.setStatus(appointment.getEstate().getState().toString());

        return dto;
    }
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getPatientName() { return patientName; }
    public void setPatientName(String patientName) { this.patientName = patientName; }

    public String getPatientCi() { return patientCi; }
    public void setPatientCi(String patientCi) { this.patientCi = patientCi; }

    public String getMedicName() { return medicName; }
    public void setMedicName(String medicName) { this.medicName = medicName; }

    public String getMedicSpecialty() { return medicSpecialty; }
    public void setMedicSpecialty(String medicSpecialty) { this.medicSpecialty = medicSpecialty; }

    public LocalDateTime getDate() { return date; }
    public void setDate(LocalDateTime date) { this.date = date; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    }
