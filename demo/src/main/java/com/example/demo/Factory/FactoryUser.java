package com.example.demo.Factory;

import com.example.demo.Dtos.UserRegistrationDto;
import com.example.demo.Model.User;

public abstract class FactoryUser {
    public abstract User CreateUser(UserRegistrationDto data);
    
}
