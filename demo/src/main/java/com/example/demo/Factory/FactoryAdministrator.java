package com.example.demo.Factory;

import com.example.demo.Dtos.UserRegistrationDto;
import com.example.demo.Model.Administrator;
import com.example.demo.Model.Patient;
import com.example.demo.Model.User;

public class FactoryAdministrator extends FactoryUser{
    @Override
    public User CreateUser(UserRegistrationDto data) {
        return new Administrator(data.getCI(), data.getEmail(), data.getPassword(), data.getName());
    }
}
