package com.anilduyguc.userservice.controller;

import com.anilduyguc.userservice.config.TwilioConfig;
import com.anilduyguc.userservice.dto.TwilioOTPResponse;
import com.anilduyguc.userservice.dto.TwiloOTPTest;
import com.anilduyguc.userservice.dto.notification.GetNotificationResponse;
import com.anilduyguc.userservice.dto.user.UserLocationRequest;
import com.anilduyguc.userservice.modal.City;
import com.anilduyguc.userservice.modal.Role;
import com.anilduyguc.userservice.modal.User;
import com.anilduyguc.userservice.service.UserService;
import com.twilio.rest.api.v2010.account.Message;
import com.twilio.type.PhoneNumber;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.text.DecimalFormat;
import java.util.List;
import java.util.Objects;
import java.util.Random;

@RequestMapping("/api/v1/user")
@CrossOrigin(origins = "http://localhost:3000", maxAge = 3600)
@RestController
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;
    private final TwilioConfig twilioConfig;

    @GetMapping
    public ResponseEntity<?> getUsers(@RequestParam(required = false) String email, @RequestParam(required = false) String ssNo){
        if(email != null){
            return new ResponseEntity<>(userService.getUserByEmail(email), HttpStatus.OK);
        } else if(ssNo != null){
            return new ResponseEntity<>(userService.getUserBySsNo(ssNo), HttpStatus.OK);
        } else {
            return ResponseEntity.ok(userService.getUsers());
        }
    }
    @GetMapping("/{userId}")
    public ResponseEntity<User> getUserById(@PathVariable String userId){
        return new ResponseEntity<>(userService.getUserById(userId), HttpStatus.OK);
    }
    @PostMapping
    public ResponseEntity<User> createUser(@RequestBody User user){
        return new ResponseEntity<>(userService.createUser(user), HttpStatus.CREATED);
    }
    @PostMapping("/create-stations")
    public ResponseEntity<List<User>> createStations(){
        return new ResponseEntity<>(userService.createStations(), HttpStatus.CREATED);
    }
    @PutMapping("/update-stations")
    public ResponseEntity<List<User>> updateStations(){
        return new ResponseEntity<>(userService.updateLocations(), HttpStatus.CREATED);
    }
    @GetMapping("/token")
    public ResponseEntity<User> getUserByToken(@RequestHeader HttpHeaders headers){
        if(headers.containsKey("authorization")){
            String token = Objects.requireNonNull(headers.get("authorization")).get(0);
            token = token.substring(7);
            return new ResponseEntity<>(userService.getUserByToken(token), HttpStatus.OK);
        }
        return new ResponseEntity<>(new User(), HttpStatus.NOT_FOUND);
    }
    @PutMapping("/{userId}")
    public ResponseEntity<User> updateUser(@PathVariable String userId, @RequestBody User user){
        return new ResponseEntity<>(userService.updateUser(userId, user), HttpStatus.OK);
    }
    @PutMapping("/{userId}/location")
    public ResponseEntity<User> setLocation(@PathVariable String userId, @RequestBody UserLocationRequest userLocationRequest){
        return new ResponseEntity<>(userService.setCurrentLocation(userId, userLocationRequest), HttpStatus.OK);
    }
    @DeleteMapping("/{userId}")
    public void deleteUser(@PathVariable String userId){
        userService.deleteUser(userId);
    }
    @GetMapping("/{id}/city")
    public ResponseEntity<City> getCityByUserId(@PathVariable String id){
        return new ResponseEntity<>(userService.getCityByUserId(id), HttpStatus.OK);
    }
    @GetMapping("/{id}/role")
    public ResponseEntity<Role> getRoleByUserId(@PathVariable String id){
        return new ResponseEntity<>(userService.getRoleByUserId(id), HttpStatus.OK);
    }
    @GetMapping("/{id}/notification")
    public ResponseEntity<List<GetNotificationResponse>> getUserNotifications(@PathVariable String id){
        System.out.println("HEREE");
        return new ResponseEntity<>(userService.getUserNotifications(id), HttpStatus.OK);
    }
    @GetMapping("/free-drivers")
    public ResponseEntity<List<User>> getFreeDrivers() {
        return new ResponseEntity<>(userService.getFreeDrivers(), HttpStatus.OK);
    }


}
