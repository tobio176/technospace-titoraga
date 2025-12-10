package com.coursework.pc_configurator.repository;

import com.coursework.pc_configurator.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    // Знайти користувача за поштою
    Optional<User> findByEmail(String email);
}