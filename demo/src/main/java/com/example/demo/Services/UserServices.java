package com.example.demo.Services;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.example.demo.Dtos.UserDto;
import com.example.demo.Dtos.UserLoginDto;
import com.example.demo.Dtos.UserRegistrationDto;
import com.example.demo.Factory.FactoryAdministrator;
import com.example.demo.Factory.FactoryMedic;
import com.example.demo.Factory.FactoryPatient;
import com.example.demo.Factory.FactoryReceptionist;
import com.example.demo.Factory.FactoryUser;
import com.example.demo.Model.User;
import com.example.demo.Repository.UserRepository;

@Service
public class UserServices {
    private final UserRepository repository;
    private final Map<String, FactoryUser> fabrics;
    public UserServices(UserRepository repository) {
        this.repository = repository;
        this.fabrics = new HashMap<>();
        this.fabrics.put("PATIENT", new FactoryPatient());
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
    public User Login(UserLoginDto dto) {
    return repository.findByCi(dto.getCi())
            .filter(user -> user.getPassword().equals(dto.getPassword()))
            .orElseThrow(() -> new RuntimeException("Credenciales inválidas"));
}

    public List<UserDto> getAllUsers() {
        List<User> users = repository.getAll();
        return users.stream().map(UserDto::fromUser).collect(Collectors.toList());
    }
}
