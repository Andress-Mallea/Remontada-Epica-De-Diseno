package com.example.demo.Model;

public abstract class User {
    protected String CI;
    protected String Email;
    protected String Password;
    protected String Name;
    public User(String CI, String Email, String Password, String Name) {
        this.CI = CI;
        this.Email = Email;
        this.Password = Password;
        this.Name = Name;
    }
}
