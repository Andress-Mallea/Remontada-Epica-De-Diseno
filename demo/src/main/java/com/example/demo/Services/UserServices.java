package com.example.demo.Services;

import com.example.demo.Dtos.UserRegistrationDto;
import com.example.demo.Factory.*;
import com.example.demo.Model.User;
import com.example.demo.Repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class UserServices {
    private final UserRepository repository;
    private final Map<String, FactoryUser> fabrics;
    public UserServices(UserRepository repository) {
        this.repository = repository;
        this.fabrics = new HashMap<>();
        this.fabrics.put("PACIENTE", new FactoryPatient());
        this.fabrics.put("MEDIC", new FactoryMedic());
        this.fabrics.put("ADMIN", new FactoryAdministrator());
        this.fabrics.put("RECEPTIONIST", new FactoryReceptionist());
    }
    public User Register(String tipoUsuario, UserRegistrationDto data) {
        FactoryUser factory = fabrics.get(tipoUsuario.toUpperCase());
        if(factory == null) {
            throw new IllegalArgumentException("tipo Usuario no soportado: " + tipoUsuario);
        }
        User newUser = factory.AddUser(data);
        repository.save(newUser);
        return newUser;
    }
}
