package com.example.demo.Services;

import com.example.demo.Dtos.RequestAppointmentDto;
import com.example.demo.Repository.UserRepository;
import org.springframework.stereotype.Service;

@Service
public class AppointmentService {
    private final UserRepository userRepository;
    public AppointmentService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }
    public String createAppointment(RequestAppointmentDto data) {
        return "";
    }
}
