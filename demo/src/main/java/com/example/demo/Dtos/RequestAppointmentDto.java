package com.example.demo.Dtos;

public class RequestAppointmentDto {
    private String requesterCi;
    private String patientCi;
    private String medicCi;
    private int day;
    private int hour;

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
