package com.anilduyguc.userservice.controller;

import com.anilduyguc.userservice.dto.notification.GetNotificationResponse;
import com.anilduyguc.userservice.modal.City;
import com.anilduyguc.userservice.modal.Role;
import com.anilduyguc.userservice.modal.User;
import com.anilduyguc.userservice.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.util.MultiValueMap;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RequestMapping("/api/v1/user")
@CrossOrigin(origins = "http://localhost:3000", maxAge = 3600)
@RestController
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;

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
    @GetMapping("/token")
    public ResponseEntity<User> getUserByToken(@RequestHeader HttpHeaders headers){
        if(headers.containsKey("authorization")){
            String token = headers.get("authorization").get(0);
            token = token.substring(7, token.length());
            return new ResponseEntity<>(userService.getUserByToken(token), HttpStatus.OK);
        }
        return new ResponseEntity<>(new User(), HttpStatus.NOT_FOUND);


    }
    @PostMapping
    public ResponseEntity<User> createUser(@RequestBody User user){
        return new ResponseEntity<>(userService.createUser(user), HttpStatus.CREATED);
    }
    @PutMapping("/{userId}")
    public ResponseEntity<User> updateUser(@PathVariable String userId, @RequestBody User user){
        return new ResponseEntity<>(userService.updateUser(userId, user), HttpStatus.OK);
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

}
