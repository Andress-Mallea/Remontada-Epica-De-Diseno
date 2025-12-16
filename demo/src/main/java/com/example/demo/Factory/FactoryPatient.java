package com.example.demo.Factory;

import com.example.demo.Dtos.UserRegistrationDto;
import com.example.demo.Model.Patient;
import com.example.demo.Model.User;

public class FactoryPatient extends FactoryUser {
    @Override
    public User CreateUser(UserRegistrationDto data) {
        return new Patient(data.getCI(), data.getEmail(), data.getPassword(), data.getName());
    }
}
