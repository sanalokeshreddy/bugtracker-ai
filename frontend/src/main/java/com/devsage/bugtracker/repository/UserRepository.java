package com.devsage.bugtracker.repository;

import com.devsage.bugtracker.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {
}
