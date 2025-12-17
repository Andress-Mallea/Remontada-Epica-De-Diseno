package com.example.demo.Model;

import com.example.demo.Observer.IObserverNotify;

public class Patient extends User implements IObserverNotify {

    public Patient(String CI, String Email, String Password, String Name) {
        super(CI, Email, Password, Name, Role.PATIENT);
    }

    @Override
    public void Notify(String message) {
        System.out.println(message);
    }
}
