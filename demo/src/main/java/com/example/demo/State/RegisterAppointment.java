package com.example.demo.State;

import java.time.LocalDateTime;

public class RegisterAppointment {
    private String Motive;
    private String Diagnostic;
    private LocalDateTime CloseHour;
    

    
    public String getMotive() {
        return Motive;
    }

    public void setMotive(String motive) {
        this.Motive = motive;
    }

    public String getDiagnostic() {
        return Diagnostic;
    }

    public void setDiagnostic(String diagnostic) {
        this.Diagnostic = diagnostic;
    }

    public LocalDateTime getCloseHour() {
        return CloseHour;
    }

    public void setCloseHour(LocalDateTime closeHour) {
        this.CloseHour = closeHour;
    }
}