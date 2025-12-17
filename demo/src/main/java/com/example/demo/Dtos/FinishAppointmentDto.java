package com.example.demo.Dtos;

public class FinishAppointmentDto {
    private String appointmentId;
    private String medicCi;
    private String motive;
    private String diagnostic;

    public String getAppointmentId() { return appointmentId; }
    public void setAppointmentId(String appointmentId) { this.appointmentId = appointmentId; }

    public String getMedicCi() { return medicCi; }
    public void setMedicCi(String medicCi) { this.medicCi = medicCi; }

    public String getMotive() { return motive; }
    public void setMotive(String motive) { this.motive = motive; }

    public String getDiagnostic() { return diagnostic; }
    public void setDiagnostic(String diagnostic) { this.diagnostic = diagnostic; }
}
