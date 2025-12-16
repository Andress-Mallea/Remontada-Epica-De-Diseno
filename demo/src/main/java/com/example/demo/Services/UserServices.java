package com.example.demo.Services;

import com.example.demo.Dtos.UserRegistrationDto;
import com.example.demo.Model.User;
import com.example.demo.Repository.UserRepository;
import org.springframework.stereotype.Service;

@Service
public class UserServices {
    private final UserRepository repository;
    public UserServices(UserRepository repository) {
        this.repository = repository;
    }
}
