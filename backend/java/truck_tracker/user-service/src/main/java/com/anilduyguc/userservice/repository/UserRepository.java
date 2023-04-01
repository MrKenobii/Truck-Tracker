package com.anilduyguc.userservice.repository;

import com.anilduyguc.userservice.modal.Role;
import com.anilduyguc.userservice.modal.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, String> {
    Optional<User> findUserByEmail(String email);
    Optional<User> findUserBySsNo(String ssNo);

    Optional<User> findUserByToken(String token);
    List<User> findUsersByRole(Role role);
}
