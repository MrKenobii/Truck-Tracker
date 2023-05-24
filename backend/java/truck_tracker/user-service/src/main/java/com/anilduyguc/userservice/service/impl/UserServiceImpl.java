package com.anilduyguc.userservice.service.impl;

import com.anilduyguc.userservice.dto.notification.GetNotificationResponse;
import com.anilduyguc.userservice.dto.user.UserLocationRequest;
import com.anilduyguc.userservice.modal.*;
import com.anilduyguc.userservice.repository.CityRepository;
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
    private final CityRepository cityRepository;
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
        userToUpdate.setSmsActivationToken(user.getSmsActivationToken());
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
        if(user.getRole().getName().equals("TRUCK_DRIVER")){
            Truck truck = truckRepository.findTruckByUser(user).orElseThrow(() -> new RuntimeException("No truck found"));
            if(truck.isTookOff()){
                truck.setLatitude(userLocationRequest.getLatitude());
                truck.setLongitude(userLocationRequest.getLongitude());
                truckRepository.save(truck);
            }
        }
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

    @Override
    public List<User> createStations() {
        List<City> cities = cityRepository.findAll();
        Role role = roleRepository.findByName("POLICE_STATION").orElseThrow(() -> new RuntimeException("No role found"));
        List<User> users = new ArrayList<>();
        for (City city: cities) {
            User user = User.builder()
                    .phoneNumber("5319337108")
                    .city(city)
                    .id(UUID.randomUUID().toString())
                    .lastName("Müdürlüğü")
                    .role(role)
                    .status("OFFLINE")
                    .latitude(city.getLatitude())
                    .longitude(city.getLongitude())
                    .password(passwordEncoder.encode("12345678"))
                    .isAccountActive(true)
                    .build();
            if(city.getName().equals("İstanbul (Anadolu)")){
                user.setEmail("istanbulanadoluemniyet@mail.com");
                user.setName("İstanbul Anadolu Emniyet");
            }else if(city.getName().equals("İstanbul (Avrupa)")){
                user.setEmail("istanbulavremniyet@mail.com");
                user.setName("İstanbul Avrupa Emniyet");
            } else {
                user.setEmail(city.getName().toLowerCase() + "emniyet@mail.com");
                user.setName(city.getName() + " Emniyet");
            }
            userRepository.save(user);
            users.add(user);
        }
        return users;
    }

    @Override
    public List<User> updateLocations() {
        Role role = roleRepository.findByName("POLICE_STATION").orElseThrow(() -> new RuntimeException("No role found"));
        List<User> users = userRepository.findUsersByRole(role);
        for (User user: users) {
            Double latitude = Double.valueOf(user.getLatitude().substring(0, 4));
            Double longitude = Double.valueOf(user.getLongitude().substring(0, 4));
            Double d = longitude - 0.02;
            Double d1 = latitude - 0.02;
            user.setLatitude(d1.toString());
            user.setLongitude(d.toString());
            userRepository.save(user);
        }
        return users;
    }
}
