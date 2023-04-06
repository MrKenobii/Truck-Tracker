package com.anilduyguc.userservice.service.impl;

import com.anilduyguc.userservice.modal.Role;
import com.anilduyguc.userservice.modal.User;
import com.anilduyguc.userservice.repository.RoleRepository;
import com.anilduyguc.userservice.service.RoleService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class RoleServiceImpl implements RoleService {
    private final RoleRepository roleRepository;

    @Override
    public List<Role> getRoles() {
        return roleRepository.findAll();
    }

    @Override
    public Role getRoleById(String id) {
        return roleRepository.findById(id).orElseThrow(() -> new RuntimeException("Role with id: " + id + " was not found"));
    }

    @Override
    public Role getRoleByName(String name) {
        return roleRepository.findByName(name).orElseThrow(() -> new RuntimeException("Role with name: " + name + " was not found"));
    }

    @Override
    public List<User> getUsersByRoleName(String name) {
        Role role = roleRepository.findByName(name).orElseThrow(() -> new RuntimeException("Role with name: " + name + " was not found"));
        return role.getUsers();
    }

    @Override
    public Role createRole(Role role) {
        String id = UUID.randomUUID().toString();
        role.setId(id);
        roleRepository.save(role);
        return role;
    }

    @Override
    public Role updateRole(String id, Role role) {
        Role roleToUpdate = roleRepository.findById(id).orElseThrow(() -> new RuntimeException("Role with id: " + id + " was not found"));
        roleToUpdate.setName(role.getName());
        roleToUpdate.setUsers(role.getUsers());
        roleRepository.save(roleToUpdate);
        return roleToUpdate;
    }

    @Override
    public void deleteRole(String id) {
        Role role = roleRepository.findById(id).orElseThrow(() -> new RuntimeException("Role with id: " + id + " was not found"));
        roleRepository.delete(role);
    }
}
