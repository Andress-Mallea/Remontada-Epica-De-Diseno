package com.example.demo.Dtos;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonFormat;

public class RequestAppointmentDto {
    private String requesterCi;
    private String patientCi;
    private String medicCi;
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime fecha;

    public LocalDateTime getFecha() {
        return fecha;
    }
    public void setFecha(LocalDateTime fecha) {
        this.fecha = fecha;
    }

    public String getRequesterCi() {
        return requesterCi;
    }

    public void setRequesterCi(String requesterCi) {
        this.requesterCi = requesterCi;
    }

    public String getPatientCi() {
        return patientCi;
    }

    public void setPatientCi(String patientCi) {
        this.patientCi = patientCi;
    }

    public String getMedicCi() {
        return medicCi;
    }

    public void setMedicCi(String medicCi) {
        this.medicCi = medicCi;
    }
}
