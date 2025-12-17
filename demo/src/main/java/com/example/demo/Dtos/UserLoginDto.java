package com.example.demo.Dtos;

public class UserLoginDto {
    private String ci;
    private String password;


    public UserLoginDto() {
    }

    public UserLoginDto(String ci, String password) {
        this.ci = ci;
        this.password = password;
    }

    // Getters y Setters
    public String getCi() {
        return ci;
    }

    public void setCi(String ci) {
        this.ci = ci;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}