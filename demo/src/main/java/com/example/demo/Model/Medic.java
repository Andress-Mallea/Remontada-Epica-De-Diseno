package com.example.demo.Model;

public class Medic extends User{
    private String Specialty;
    public Medic(String CI, String Email, String Password, String Name, String Specialty) {
        super(CI, Email, Password, Name);
        this.Specialty = Specialty;
    }
}
