package com.example.demo.Model;

public abstract class User {
    protected String CI;
    protected String Email;
    protected String Password;
    protected String Name;
    protected Role role;
    public User(String CI, String Email, String Password, String Name, Role role) {
        this.CI = CI;
        this.Email = Email;
        this.Password = Password;
        this.Name = Name;
        this.role = role;
    }

    public String getCI() {
        return CI;
    }
    public String getEmail() {
        return this.Email;
    }
    public String getName() {
        return this.Name;
    }
    public Role getRole() {
        return role;
    }
}
