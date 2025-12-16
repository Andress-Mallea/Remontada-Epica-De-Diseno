package com.example.demo.Factory;

import com.example.demo.Dtos.UserRegistrationDto;
import com.example.demo.Model.Receptionist;
import com.example.demo.Model.User;

public class FactoryReceptionist extends FactoryUser{
    @Override
    public User CreateUser(UserRegistrationDto data) {
        return new Receptionist(data.getCi(), data.getEmail(), data.getPassword(), data.getName());
    }
}
