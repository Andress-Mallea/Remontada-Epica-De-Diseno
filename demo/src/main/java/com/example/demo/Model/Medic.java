package com.example.demo.Model;

import com.example.demo.Observer.IObserverNotify;

public class Medic extends User implements IObserverNotify {
    private String Specialty;
    private Shedule Agenda;
    public Medic(String CI, String Email, String Password, String Name, String Specialty) {
        super(CI, Email, Password, Name);
        this.Specialty = Specialty;
        this.Agenda = new Shedule();
    }
    @Override
    public void Notify(String message) {
        //System.out.println(message);
    }
}
