package com.anilduyguc.userservice.controller;

import com.anilduyguc.userservice.modal.City;
import com.anilduyguc.userservice.modal.Role;
import com.anilduyguc.userservice.modal.User;
import com.anilduyguc.userservice.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequestMapping("/api/v1/user")
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

}
