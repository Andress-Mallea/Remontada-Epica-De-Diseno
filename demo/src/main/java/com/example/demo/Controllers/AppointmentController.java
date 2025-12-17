package com.example.demo.Controllers;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.Dtos.AppointmentDto;
import com.example.demo.Dtos.FinishAppointmentDto;
import com.example.demo.Dtos.RequestAppointmentDto;
import com.example.demo.Services.AppointmentService;

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
    @PostMapping("/{id}/confirm")
    public ResponseEntity<?> confirm(@PathVariable String id, @RequestParam String resquesterCi) {
        try {
            service.confirmAppointment(id, resquesterCi);
            return ResponseEntity.ok("Cita confirmada exitosamente");
        }
        catch (SecurityException e) {
            return ResponseEntity.status(403).body("Acceso denegado: " + e.getMessage());
        }
        catch (IllegalStateException e) {
            return ResponseEntity.badRequest().body("Error de estado: " + e.getMessage());
        }
        catch (RuntimeException e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
        catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error inesperado: " + e.getMessage());
        }
    }
    @PostMapping("/{id}/cancel")
    public ResponseEntity<?> cancel(@PathVariable String id, @RequestParam String requeserCi) {
        try {
            service.cancelAppoint(id,requeserCi);
            return ResponseEntity.ok("Cita cancelada exitosamente");
        }
        catch (SecurityException e) {
            return ResponseEntity.status(403).body("Acceso denegado: " + e.getMessage());
        }
        catch (IllegalStateException e) {
            return ResponseEntity.badRequest().body("Error de estado: " + e.getMessage());
        }
        catch (RuntimeException e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
        catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error inesperado: " + e.getMessage());
        }
    }
    @PostMapping("/attend")
    public ResponseEntity<?> attend(@RequestBody FinishAppointmentDto dto) {
        try {
            service.attendAppointment(dto);
            return ResponseEntity.ok("Cita atendida y finalizada exitosamente");
        }
        catch (SecurityException e) {
            return ResponseEntity.status(403).body("Acceso denegado: " + e.getMessage());
        }
        catch (IllegalStateException e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
        catch (RuntimeException e) {
            return ResponseEntity.badRequest().body("Error: "+ e.getMessage());
        }
        catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error interno: " + e.getMessage());
        }
    }

}
