package com.anilduyguc.userservice.service.impl;

import com.anilduyguc.userservice.modal.City;
import com.anilduyguc.userservice.modal.Role;
import com.anilduyguc.userservice.modal.User;
import com.anilduyguc.userservice.repository.UserRepository;
import com.anilduyguc.userservice.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {
    private final UserRepository userRepository;
    @Override
    public List<User> getUsers() {
        return userRepository.findAll();
    }

    @Override
    public User getUserById(String id) {
        return userRepository.findById(id).orElseThrow(() -> {
            throw new RuntimeException("User with id: " + id + " was not found");
        });
    }
    @Override
    public User getUserByEmail(String email) {
        return userRepository.findUserByEmail(email).orElseThrow(() -> {
            throw new RuntimeException("User with email: " + email + " does not exists");
        });
    }

    @Override
    public User getUserBySsNo(String ssNo) {
        return null;
    }

    @Override
    public City getCityByUserId(String id) {
        User user = userRepository.findById(id).orElseThrow(() -> {
            throw new RuntimeException("User with id: " + id + " was not found");
        });
        return user.getCity();
    }

    @Override
    public Role getRoleByUserId(String id) {
        User user = userRepository.findById(id).orElseThrow(() -> {
            throw new RuntimeException("User with id: " + id + " was not found");
        });
        return user.getRole();
    }

    @Override
    public User createUser(User user) {
        String id = UUID.randomUUID().toString();
        user.setId(id);
        userRepository.save(user);
        return user;
    }

    @Override
    public User updateUser(String id, User user) {
        User userToUpdate = userRepository.findById(id).orElseThrow(() -> {
            throw new RuntimeException("User with id: " + id + " was not found");
        });
        userToUpdate.setId(user.getId());
        userToUpdate.setName(user.getName());
        userToUpdate.setLastName(user.getLastName());
        userToUpdate.setEmail(user.getEmail());
        userToUpdate.setPhoneNumber(user.getPhoneNumber());
        userToUpdate.setPassword(user.getPassword());
        userToUpdate.setSsNo(user.getSsNo());
        userToUpdate.setAccountActive(user.isAccountActive());
        userToUpdate.setStatus(user.getStatus());
//        userToUpdate.setCity(user.getCity());
//        userToUpdate.setNotification(user.getNotification());
//        userToUpdate.setRole(user.getRole());
        userRepository.save(userToUpdate);
        return userToUpdate;
    }

    @Override
    public void deleteUser(String id) {
        User user = userRepository.findById(id).orElseThrow(() -> {
            throw new RuntimeException("User with id: " + id + " was not found");
        });
        userRepository.delete(user);
    }
}
