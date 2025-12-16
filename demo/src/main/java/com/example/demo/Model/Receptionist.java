package com.example.demo.Model;

import com.example.demo.State.Appointment;

import java.util.LinkedList;
import java.util.Queue;

public class Receptionist extends User{
    public Receptionist(String CI, String Email, String Password, String Name) {
        super(CI, Email, Password, Name, Role.RECEPTIONIST);
    }
}