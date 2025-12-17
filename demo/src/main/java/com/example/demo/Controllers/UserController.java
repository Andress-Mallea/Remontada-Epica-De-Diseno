package com.example.demo.Controllers;

import java.util.List;

import org.springframework.http.ResponseEntity; // Importación necesaria
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.Dtos.UserDto;
import com.example.demo.Dtos.UserLoginDto;
import com.example.demo.Dtos.UserRegistrationDto;
import com.example.demo.Model.Medic;
import com.example.demo.Model.User;
import com.example.demo.Repository.UserRepository;
import com.example.demo.Services.UserServices;

@RestController
@RequestMapping("/users")
public class UserController {
    
    private UserServices service;
    private UserRepository userRepository; // 2. Declarar la variable del repositorio

    // 3. Inyectar ambos en el constructor para solucionar el error "userRepository cannot be resolved"
    public UserController(UserServices service, UserRepository userRepository) {
        this.service = service;
        this.userRepository = userRepository;
    }

    @PostMapping("/register")
    public ResponseEntity<?> registrar(@RequestBody UserRegistrationDto dto) {
        try {
            service.Register(dto.getTipo(), dto);
            return ResponseEntity.ok("Usuario Registrado exitosamente");
        }
        catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body("Datos invalidos: " + e.getMessage());
        }
        catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error al registrar: " + e.getMessage());
        }
    }

    @GetMapping
    public ResponseEntity<List<UserDto>> getAllUsers() {
        return ResponseEntity.ok(service.getAllUsers());
    }

    @PostMapping("/login")
    public User login(@RequestBody UserLoginDto dto) {
        return service.Login(dto);
    }

    @GetMapping("/search/{ci}")
    public ResponseEntity<?> getUserByCi(@PathVariable String ci) {
        // 4. Ahora userRepository ya es reconocido por la clase
        return userRepository.findByCi(ci)
            .map(user -> {
                // Verificamos que sea un paciente para habilitar el botón en el frontend
                String tipoUsuario = user.getRole().toString();
                if (!tipoUsuario.equalsIgnoreCase("PATIENT")) {
                    return ResponseEntity.badRequest().body("El usuario encontrado no es un paciente");
                }
                return ResponseEntity.ok(user);
            })
            .orElse(ResponseEntity.status(404).body("Paciente no encontrado"));
    }
   @GetMapping("/medics")
    public ResponseEntity<List<UserDto>> getOnlyMedics() {
        // Usamos el servicio para obtener todos y filtramos en el controlador
        // o mejor aún, crea un método en el servicio que haga la consulta filtrada
        List<UserDto> medics = service.getAllUsers().stream()
                .filter(user -> user.getRol().equalsIgnoreCase("MEDIC"))
                .toList();
        return ResponseEntity.ok(medics);
    }
    @GetMapping("/medic/{ci}/agenda")
    public ResponseEntity<?> getMedicAgenda(@PathVariable String ci) {
    User user = userRepository.findUserByCi(ci);
    if (user instanceof Medic) {
        // Retorna las citas asociadas a la agenda del médico
        return ResponseEntity.ok(((Medic) user).getAgenda().getAllAppointments());
    }
    return ResponseEntity.status(404).body("Médico no encontrado");
}
}