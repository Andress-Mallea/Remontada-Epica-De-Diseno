package com.example.demo.Factory;

import com.example.demo.Dtos.UserRegistrationDto;
import com.example.demo.Model.Medic;
import com.example.demo.Model.User;

public class FactoryMedic extends FactoryUser{
    @Override
    public User CreateUser(UserRegistrationDto data) {
        return new Medic(data.getCi(), data.getEmail(), data.getPassword(), data.getName(), data.getSpecialty());
    }
}
