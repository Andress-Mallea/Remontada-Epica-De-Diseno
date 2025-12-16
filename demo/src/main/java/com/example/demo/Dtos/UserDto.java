package com.example.demo.Dtos;

import com.example.demo.Model.User;

public class UserDto {
    private String ci;
    private String email;
    private String name;
    private String rol;

    public static UserDto fromUser(User user) {
        UserDto dto = new UserDto();
        dto.setCi(user.getCI());
        dto.setEmail(user.getEmail());
        dto.setName(user.getName());
        dto.setRol(user.getRole().toString());
        return dto;
    }
    public String getCi() { return ci; }
    public void setCi(String ci) { this.ci = ci; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getRol() { return rol; }
    public void setRol(String rol) { this.rol = rol; }
}
