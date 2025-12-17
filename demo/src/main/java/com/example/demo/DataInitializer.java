package com.example.demo;

import java.time.LocalDateTime;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.example.demo.Dtos.RequestAppointmentDto;
import com.example.demo.Dtos.UserRegistrationDto;
import com.example.demo.Factory.FactoryAdministrator;
import com.example.demo.Factory.FactoryMedic;
import com.example.demo.Factory.FactoryPatient;
import com.example.demo.Factory.FactoryReceptionist;
import com.example.demo.Model.User;
import com.example.demo.Repository.UserRepository;
import com.example.demo.Services.AppointmentService;

@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner initDatabase(UserRepository userRepository, AppointmentService appointmentService) {
        return args -> {


            if (userRepository.findByCi("123456").isEmpty()) {
                FactoryAdministrator adminFactory = new FactoryAdministrator();

                UserRegistrationDto adminDto = new UserRegistrationDto();
                adminDto.setCi("123456");
                adminDto.setName("Admin");
                adminDto.setEmail("admin@clinic.com");
                adminDto.setPassword("admin123");
                adminDto.setTipo("ADMINISTRATOR");

                User admin = adminFactory.AddUser(adminDto);
                userRepository.save(admin);
            }


            if (userRepository.findByCi("1122334").isEmpty()) {
                FactoryAdministrator adminFactory2 = new FactoryAdministrator();

                UserRegistrationDto adminDto2 = new UserRegistrationDto();
                adminDto2.setCi("1122334");
                adminDto2.setName("Admin2");
                adminDto2.setEmail("admin2@clinic.com");
                adminDto2.setPassword("admin1233");
                adminDto2.setTipo("ADMINISTRATOR");

                User admin2 = adminFactory2.AddUser(adminDto2);
                userRepository.save(admin2);
            }

            if (userRepository.findByCi("789012").isEmpty()) {
                FactoryMedic medicFactory = new FactoryMedic();

                UserRegistrationDto medicDto = new UserRegistrationDto();
                medicDto.setCi("789012");
                medicDto.setName("Dr. House");
                medicDto.setEmail("dr@clinic.com");
                medicDto.setPassword("medic123");
                medicDto.setTipo("MEDIC");
                medicDto.setSpecialty("Cardiologia");

                User medic = medicFactory.AddUser(medicDto);
                userRepository.save(medic);
            }

            if (userRepository.findByCi("787878").isEmpty()) {
                FactoryMedic medicFactory2 = new FactoryMedic();

                UserRegistrationDto medicDto2 = new UserRegistrationDto();
                medicDto2.setCi("787878");
                medicDto2.setName("Dr. Hospital");
                medicDto2.setEmail("dr2@clinic.com");
                medicDto2.setPassword("medic123");
                medicDto2.setTipo("MEDIC");
                medicDto2.setSpecialty("Pediatria");

                User medic = medicFactory2.AddUser(medicDto2);
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


            if (userRepository.findByCi("123123").isEmpty()) {
                FactoryPatient patientFactory2 = new FactoryPatient();

                UserRegistrationDto patientDto2 = new UserRegistrationDto();
                patientDto2.setCi("123123");
                patientDto2.setName("Pedro Picapiedra");
                patientDto2.setEmail("juan@mail.com");
                patientDto2.setPassword("paciente123");
                patientDto2.setTipo("PATIENT");

                userRepository.save(patientFactory2.AddUser(patientDto2));
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
            


            RequestAppointmentDto cita = new RequestAppointmentDto();
            cita.setRequesterCi("333444"); 
            cita.setPatientCi("111222");
            cita.setMedicCi("789012");

            RequestAppointmentDto cita2 = new RequestAppointmentDto();
            cita2.setRequesterCi("123123"); 
            cita2.setPatientCi("123123");
            cita2.setMedicCi("789012");

            LocalDateTime f = LocalDateTime.now()
                    .plusDays(1)
                    .withHour(10).withMinute(0).withSecond(0).withNano(0);

            while (f.getDayOfWeek().getValue() > 5) { 
                f = f.plusDays(1);
            }

            cita.setFecha(f);
            cita2.setFecha(f.plusHours(1));
        if (appointmentService.getAllAppoinments().isEmpty()) { 
            try {
                System.out.println("Seeder cita 1: " + appointmentService.createAppointment(cita));
                System.out.println("Seeder cita 2: " + appointmentService.createAppointment(cita2));
            } catch (Exception ex) {
                System.out.println("Error en seeder: " + ex.getMessage());
            }
        }

        };
    }
}