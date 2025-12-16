package com.example.demo.Controllers;

import com.example.demo.Dtos.RequestAppointmentDto;
import com.example.demo.Services.AppointmentService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/appointmentController")
public class AppointmentController {
    private final AppointmentService service;
    public AppointmentController(AppointmentService service) {
        this.service = service;
    }
    @PostMapping("/create")
    public ResponseEntity<?> create(@RequestBody RequestAppointmentDto dto) {
        try {
            String result = service.createAppointment(dto);
            return ResponseEntity.ok(result);
        }
        catch (SecurityException e) {
            return ResponseEntity.status(403).body("Error: " + e.getMessage());
        }
        catch (IllegalArgumentException | IllegalStateException e) {
            return ResponseEntity.badRequest().body("No se pudo agendar: " + e.getMessage());
        }
        catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error interno: " + e.getMessage());
        }
    }
}
