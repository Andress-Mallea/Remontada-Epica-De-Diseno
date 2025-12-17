package com.example.demo.Controllers;

import com.example.demo.Dtos.AppointmentDto;
import com.example.demo.Dtos.RequestAppointmentDto;
import com.example.demo.Services.AppointmentService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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
    @GetMapping
    public ResponseEntity<List<AppointmentDto>> getAll() {
        try {
            List<AppointmentDto> dtos = service.getAllAppoinments();
            return ResponseEntity.ok(dtos);
        }
        catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
}
