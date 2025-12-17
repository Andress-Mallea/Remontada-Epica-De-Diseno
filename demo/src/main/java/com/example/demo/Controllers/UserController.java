package com.example.demo.Controllers;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.Dtos.UserDto;
import com.example.demo.Dtos.UserLoginDto;
import com.example.demo.Dtos.UserRegistrationDto;
import com.example.demo.Model.User;
import com.example.demo.Services.UserServices;

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
    @PostMapping("/login")
    public User login(@RequestBody UserLoginDto dto) {
        return service.Login(dto);
    }
}
