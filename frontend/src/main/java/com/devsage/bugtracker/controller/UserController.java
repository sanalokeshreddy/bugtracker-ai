package com.devsage.bugtracker.controller;

import com.devsage.bugtracker.model.User;
import com.devsage.bugtracker.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:3000") // Optional: for frontend access
@RestController
@RequestMapping("/users")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    // ✅ GET all users
    @GetMapping
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    // ✅ POST a new user
    @PostMapping
    public User createUser(@RequestBody User user) {
        return userRepository.save(user);
    }

    // ✅ GET a single user by ID — 🔥 NEW
    @GetMapping("/{id}")
    public User getUserById(@PathVariable Long id) {
        return userRepository.findById(id).orElse(null);
    }
}
