package com.anilduyguc.userservice.auth;

import com.anilduyguc.userservice.dto.auth.*;
import com.anilduyguc.userservice.modal.User;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {
    private final AuthService authService;
    @PostMapping("/register")
    public ResponseEntity<AuthenticationResponse> register(@RequestBody RegisterRequest registerRequest){
        return new ResponseEntity<>(authService.register(registerRequest), HttpStatus.OK);
    }
    @PostMapping("/authenticate")
    public ResponseEntity<AuthenticationResponse> authenticate(@RequestBody AuthenticationRequest authenticationRequest){
        return new ResponseEntity<>(authService.authenticate(authenticationRequest), HttpStatus.OK);
    }
    @PostMapping("/logout/{id}")
    public ResponseEntity<LogoutResponse> logout(@PathVariable String id){
        return new ResponseEntity<>(authService.logout(id), HttpStatus.OK);
    }
    @PutMapping("/forgot-password")
    public ResponseEntity<ForgotPasswordResponse> forgotPassword(@RequestBody ForgotPasswordRequest forgotPasswordRequest){
        return new ResponseEntity<ForgotPasswordResponse>(authService.forgotPassword(forgotPasswordRequest), HttpStatus.OK);
    }
    @PutMapping("/update-password/{userId}")
    public ResponseEntity<UpdatePasswordResponse> forgotPassword(@RequestBody UpdatePasswordRequest updatePasswordRequest, @PathVariable String userId){
        return new ResponseEntity<UpdatePasswordResponse>(authService.updatePassword(updatePasswordRequest, userId), HttpStatus.OK);
    }
    @GetMapping("/user/{userId}")
    public ResponseEntity<User> getUserById(@PathVariable String userId){
        return new ResponseEntity<>(authService.getUserById(userId), HttpStatus.OK);
    }
}

