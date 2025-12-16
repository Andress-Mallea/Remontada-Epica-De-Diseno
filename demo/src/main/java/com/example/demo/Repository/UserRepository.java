package com.example.demo.Repository;

import com.example.demo.Model.Medic;
import com.example.demo.Model.User;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;

@Repository
public class UserRepository {
    private List<User> Users = new ArrayList<>();
    public void save(User u) {
        Users.add(u);
    }
    public List<User> getAll() {
        return Users;
    }
    public User findByCi(String Ci) {
        return  Users.stream().filter(x-> x.getCI().equals(Ci)).findFirst().orElse(null);
    }

}
