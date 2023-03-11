package com.anilduyguc.userservice.repository;

import com.anilduyguc.userservice.modal.Role;
import com.anilduyguc.userservice.modal.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface RoleRepository extends JpaRepository<Role, String> {
    Optional<Role> findByName(String name);
}
