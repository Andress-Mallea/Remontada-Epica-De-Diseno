package com.example.demo.Factory;

import com.example.demo.Dtos.UserRegistrationDto;
import com.example.demo.Model.User;
import com.example.demo.Repository.UserRepository;

public abstract class FactoryUser {
    public abstract User CreateUser(UserRegistrationDto data);
    public User AddUser(UserRegistrationDto data) {
        User newUser = CreateUser(data);
        return newUser;
    }
}
