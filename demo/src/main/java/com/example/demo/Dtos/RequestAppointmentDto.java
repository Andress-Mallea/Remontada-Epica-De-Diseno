package com.example.demo.Dtos;

import java.time.LocalDateTime;

public class RequestAppointmentDto {
    private String requesterCi;
    private String patientCi;
    private String medicCi;
    private LocalDateTime fecha;
    private int day;
    private int hour;

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

    public int getDay() {
        return day;
    }

    public void setDay(int day) {
        this.day = day;
    }

    public int getHour() {
        return hour;
    }

    public void setHour(int hour) {
        this.hour = hour;
    }
}
