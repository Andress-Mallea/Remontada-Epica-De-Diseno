package com.example.demo.Controllers;

import com.example.demo.Dtos.UserDto;
import com.example.demo.Dtos.UserRegistrationDto;
import com.example.demo.Model.User;
import com.example.demo.Services.UserServices;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/users")
public class UserController {
    private UserServices service;
    public UserController(UserServices service) {
        this.service = service;
    }
    @PostMapping("/register")
    public ResponseEntity<?> registrar(@RequestBody UserRegistrationDto dto) {
        try {
            service.Register(dto.getTipo(), dto);
            return ResponseEntity.ok("UsuarioRegistrado exitosamente");
        }
        catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body("Datos invalidos: " + e.getMessage());
        }
        catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error al registrar: " + e.getMessage());
        }
    }
    @GetMapping
    public ResponseEntity<List<UserDto>> getAllUsers() {
        return ResponseEntity.ok(service.getAllUsers());
    }
}
