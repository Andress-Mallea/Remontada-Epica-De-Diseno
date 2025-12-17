package com.example.demo.Repository;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Repository;

import com.example.demo.Model.User;

@Repository
public class UserRepository {
    private List<User> Users = new ArrayList<>();
    public void save(User u) {
        Users.add(u);
    }
    public List<User> getAll() {
        return Users;
    }
    public Optional<User> findByCi(String Ci) {
        return Users.stream()
                    .filter(x -> x.getCI().equals(Ci))
                    .findFirst(); 
    }
    
}
