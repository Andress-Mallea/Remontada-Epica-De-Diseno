package com.example.demo.Controllers;

import com.example.demo.Dtos.UserRegistrationDto;
import com.example.demo.Model.User;
import com.example.demo.Services.UserServices;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/users")
public class UserController {
    private UserServices service;
    public UserController(UserServices service) {
        this.service = service;
    }
    @PostMapping("/register")
    public String registrar(@RequestBody UserRegistrationDto dto) {
        User u = service.Register(dto.getTipo(), dto);
        return "Usuario creado exitosamente";
    }
}
