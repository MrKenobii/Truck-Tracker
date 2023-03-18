package com.anilduyguc.userservice.service;

import com.anilduyguc.userservice.modal.City;
import com.anilduyguc.userservice.modal.Role;
import com.anilduyguc.userservice.modal.User;

import java.util.List;

public interface UserService {
    List<User> getUsers();
    User getUserById(String id);
    User getUserByEmail(String email);
    User getUserBySsNo(String ssNo);
    City getCityByUserId(String id);
    Role getRoleByUserId(String id);
    User createUser(User user);
    User updateUser(String id, User user);
    void deleteUser(String id);
    User getUserByToken(String token);
}
