package com.anilduyguc.userservice.service.impl;

import com.anilduyguc.userservice.dto.notification.GetNotificationResponse;
import com.anilduyguc.userservice.dto.user.UserLocationRequest;
import com.anilduyguc.userservice.modal.*;
import com.anilduyguc.userservice.repository.RoleRepository;
import com.anilduyguc.userservice.repository.TruckRepository;
import com.anilduyguc.userservice.repository.UserRepository;
import com.anilduyguc.userservice.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {
    private final UserRepository userRepository;
    private final TruckRepository truckRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    @Override
    public List<User> getUsers() {
        return userRepository.findAll();
    }

    @Override
    public User getUserById(String id) {
        return userRepository.findById(id).orElseThrow(() -> new RuntimeException("User with id: " + id + " was not found"));
    }
    @Override
    public User getUserByEmail(String email) {
        return userRepository.findUserByEmail(email).orElseThrow(() -> new RuntimeException("User with email: " + email + " does not exists"));
    }

    @Override
    public User getUserBySsNo(String ssNo) {
        return null;
    }

    @Override
    public City getCityByUserId(String id) {
        User user = userRepository.findById(id).orElseThrow(() -> new RuntimeException("User with id: " + id + " was not found"));
        return user.getCity();
    }

    @Override
    public Role getRoleByUserId(String id) {
        User user = userRepository.findById(id).orElseThrow(() -> new RuntimeException("User with id: " + id + " was not found"));
        return user.getRole();
    }

    @Override
    public User createUser(User user) {
        String id = UUID.randomUUID().toString();
        user.setId(id);
        user.setStatus("OFFLINE");
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        userRepository.save(user);
        return user;
    }

    @Override
    public User updateUser(String id, User user) {
        User userToUpdate = userRepository.findById(id).orElseThrow(() -> new RuntimeException("User with id: " + id + " was not found"));
        userToUpdate.setId(user.getId());
        userToUpdate.setName(user.getName());
        userToUpdate.setLastName(user.getLastName());
        userToUpdate.setEmail(user.getEmail());
        userToUpdate.setPhoneNumber(user.getPhoneNumber());
        userToUpdate.setPassword(passwordEncoder.encode(user.getPassword()));
        userToUpdate.setSsNo(user.getSsNo());
        userToUpdate.setAccountActive(user.isAccountActive());
        userToUpdate.setStatus(user.getStatus());
        userToUpdate.setLatitude(user.getLatitude());
        userToUpdate.setLongitude(user.getLongitude());
        userToUpdate.setAccountActivationToken(user.getAccountActivationToken());
//        userToUpdate.setCity(user.getCity());
//        userToUpdate.setNotification(user.getNotification());
//        userToUpdate.setRole(user.getRole());
        userRepository.save(userToUpdate);
        return userToUpdate;
    }

    @Override
    public void deleteUser(String id) {
        User user = userRepository.findById(id).orElseThrow(() -> new RuntimeException("User with id: " + id + " was not found"));
        userRepository.delete(user);
    }
    @Override
    public User getUserByToken(String token) {
        System.out.println(token);
        return userRepository.findUserByToken(token).orElseThrow(() -> new RuntimeException("User with token: " + token + " was not found"));
    }

    @Override
    public List<GetNotificationResponse> getUserNotifications(String id) {
        User user = userRepository.findById(id).orElseThrow(() -> new RuntimeException("User with id: " + id + " was not found"));
        System.out.println(user.getName() + " " + user.getLastName());
        List<GetNotificationResponse> getNotificationResponseList = new ArrayList<>();

        if(user.getNotifications().size() > 0){
            System.out.println(user.getNotifications().size());
        } else {
            System.out.println("Empty List");
        }
        for(Notification notification: user.getNotifications()){
            getNotificationResponseList.add(GetNotificationResponse.builder()
                            .content(notification.getContent())
                            .emergencyLevel(notification.getEmergencyLevel())
                            .id(notification.getId())
                    .build());
        }
        return getNotificationResponseList;
    }

    @Override
    public User setCurrentLocation(String userId, UserLocationRequest userLocationRequest) {
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User with id: " + userId + " was not found"));
        user.setLongitude(userLocationRequest.getLongitude());
        user.setLatitude(userLocationRequest.getLatitude());
        return userRepository.save(user);
    }

    @Override
    public List<User> getFreeDrivers() {
        Role role = roleRepository.findByName("TRUCK_DRIVER").orElseThrow(() -> new RuntimeException("No role found"));
        List<User> users = new ArrayList<>();
        List<User> truckDrivers = userRepository.findUsersByRole(role);
        for(User driver: truckDrivers){
            Optional<Truck> truckByUser = truckRepository.findTruckByUser(driver);
            if(truckByUser.isEmpty()){
                users.add(driver);
            }
        }

        return users;
    }
}
