package com.example.demo.Dtos;

public class UserRegistrationDto {
    // 1. Cambiar atributos a minúscula (convención Java)
    private String ci;
    private String email;
    private String password;
    private String name;
    private String specialty;
    private String tipo; // Este campo es CRÍTICO para tu Factory

    // 2. Agregar Getters Y SETTERS (Indispensable para recibir datos)

    public String getCi() { return ci; }
    public void setCi(String ci) { this.ci = ci; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getSpecialty() { return specialty; }
    public void setSpecialty(String specialty) { this.specialty = specialty; }

    public String getTipo() { return tipo; }
    public void setTipo(String tipo) { this.tipo = tipo; }
}