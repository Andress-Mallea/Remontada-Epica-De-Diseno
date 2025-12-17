package com.example.demo;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.example.demo.Dtos.UserRegistrationDto;
import com.example.demo.Factory.FactoryAdministrator;
import com.example.demo.Factory.FactoryMedic;
import com.example.demo.Factory.FactoryPatient;
import com.example.demo.Factory.FactoryReceptionist;
import com.example.demo.Model.User;
import com.example.demo.Repository.UserRepository;

@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner initDatabase(UserRepository userRepository) {
        return args -> {
            if (userRepository.findByCi("123456").isEmpty()) {
                FactoryAdministrator adminFactory = new FactoryAdministrator();
                
                UserRegistrationDto adminDto = new UserRegistrationDto();
                adminDto.setCi("123456");
                adminDto.setName("Admin");
                adminDto.setEmail("admin@clinic.com");
                adminDto.setPassword("admin123");
                adminDto.setTipo("ADMIN");

                User admin = adminFactory.AddUser(adminDto);
                userRepository.save(admin);
            }

            if (userRepository.findByCi("789012").isEmpty()) {
                FactoryMedic medicFactory = new FactoryMedic();
                
                UserRegistrationDto medicDto = new UserRegistrationDto();
                medicDto.setCi("789012");
                medicDto.setName("Dr. House");
                medicDto.setEmail("dr@clinic.com");
                medicDto.setPassword("medic123");
                medicDto.setTipo("MEDIC");

                User medic = medicFactory.AddUser(medicDto);
                userRepository.save(medic);
            }
            if (userRepository.findByCi("111222").isEmpty()) {
                FactoryPatient patientFactory = new FactoryPatient();
                UserRegistrationDto patientDto = new UserRegistrationDto();
                patientDto.setCi("111222");
                patientDto.setName("Juan Paciente");
                patientDto.setEmail("juan@mail.com");
                patientDto.setPassword("paciente123");
                patientDto.setTipo("PATIENT");
                userRepository.save(patientFactory.AddUser(patientDto));
            }

            if (userRepository.findByCi("333444").isEmpty()) {
                FactoryReceptionist receptionistFactory = new FactoryReceptionist();
                UserRegistrationDto recepDto = new UserRegistrationDto();
                recepDto.setCi("333444");
                recepDto.setName("Ana Recepcion");
                recepDto.setEmail("ana@clinic.com");
                recepDto.setPassword("recep123");
                recepDto.setTipo("RECEPTIONIST");
                userRepository.save(receptionistFactory.AddUser(recepDto));
            }
        };
    }
}