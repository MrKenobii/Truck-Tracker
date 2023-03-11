package com.anilduyguc.userservice.repository;

import com.anilduyguc.userservice.modal.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, String> {
    Optional<User> findUserByEmail(String email);
    Optional<User> findUserBySsNo(String ssNo);
}
