package com.example.demo.Repository;

import com.example.demo.Model.User;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;

@Repository
public class UserRepository {
    private List<User> Users = new ArrayList<>();
    public void guardar(User u) {
        Users.add(u);
    }
    public List<User> getAll() {
        return Users;
    }
}
