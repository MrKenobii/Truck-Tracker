package com.anilduyguc.userservice.service;

import com.anilduyguc.userservice.modal.Role;
import com.anilduyguc.userservice.modal.User;

import java.util.List;

public interface RoleService {
    List<Role> getRoles();
    Role getRoleById(String id);
    Role getRoleByName(String name);
    List<User> getUsersByRoleName(String name);
    Role createRole(Role role);
    Role updateRole(String id, Role role);
    void deleteRole(String id);
}
