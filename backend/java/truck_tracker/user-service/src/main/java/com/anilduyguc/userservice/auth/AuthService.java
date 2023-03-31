package com.anilduyguc.userservice.auth;

import com.anilduyguc.userservice.config.JwtService;
import com.anilduyguc.userservice.dto.auth.*;
import com.anilduyguc.userservice.modal.City;
import com.anilduyguc.userservice.modal.Role;
import com.anilduyguc.userservice.modal.User;
import com.anilduyguc.userservice.repository.CityRepository;
import com.anilduyguc.userservice.repository.RoleRepository;
import com.anilduyguc.userservice.repository.UserRepository;
import com.anilduyguc.userservice.service.EmailService;
import jakarta.mail.MessagingException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final UserRepository userRepository;
    private final CityRepository cityRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final EmailService emailService;

    public AuthenticationResponse register(RegisterRequest registerRequest) {
        Optional<User> userByEmail = userRepository.findUserByEmail(registerRequest.getEmail());
        if(userByEmail.isPresent()){
            return AuthenticationResponse.builder().token(null).message("Email is already taken").build();
        } else {
            City city = cityRepository.findCitiesByName(registerRequest.getCity()).orElseThrow(() -> new RuntimeException("No city found with name " + registerRequest.getCity()));
            Role role = roleRepository.findByName(registerRequest.getRole()).orElseThrow(() -> new RuntimeException("No role found with name " + registerRequest.getRole()));
            var user = User.builder()
                    .id(UUID.randomUUID().toString())
                    .isAccountActive(false)
                    .status("OFFLINE")
                    .phoneNumber(registerRequest.getPhoneNumber())
                    .city(city)
                    .name(registerRequest.getFirstName())
                    .lastName(registerRequest.getLastName())
                    .email(registerRequest.getEmail())
                    .password(passwordEncoder.encode(registerRequest.getPassword()))
                    .role(role)
                    .build();
            var jwt = jwtService.generateToken(user);
            user.setToken(jwt);
            userRepository.save(user);
            return AuthenticationResponse.builder()
                    .token(jwt)
                    .message("Register successful")
                    .build();
        }

    }

    public AuthenticationResponse authenticate(AuthenticationRequest authenticationRequest) {
        authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(authenticationRequest.getEmail(), authenticationRequest.getPassword()));
        var user = userRepository.findUserByEmail(authenticationRequest.getEmail()).orElseThrow(() -> new RuntimeException("No user found"));
        var jwt = jwtService.generateToken(user);
        if(user.getStatus().equals("OFFLINE")){
            user.setToken(jwt);
            user.setStatus("ONLINE");
            userRepository.save(user);

            return AuthenticationResponse.builder()
                    .token(jwt)
                    .message("Login successful")
                    .build();
        } else {
            return AuthenticationResponse.builder()
                    .token(null)
                    .message("Login unsuccessful")
                    .build();
        }
    }

    public LogoutResponse logout(String id) {
        var user = userRepository.findById(id).orElseThrow(() -> new RuntimeException("No user found"));
        if(user.getStatus().equals("ONLINE")){
            user.setStatus("OFFLINE");
            userRepository.save(user);
            return LogoutResponse.builder()
                    .message("User with email " + user.getEmail() + " has logged out")
                    .status(user.getStatus())
                    .build();
        } else {
            return LogoutResponse.builder()
                    .message("User with email " + user.getEmail() + " is already logged out")
                    .status("OFFLINE")
                    .build();
        }
    }
    public ForgotPasswordResponse forgotPassword(ForgotPasswordRequest forgotPasswordRequest) {
        User user = userRepository.findUserByEmail(forgotPasswordRequest.getEmail()).orElseThrow(() -> {
            throw new RuntimeException("No user found with email: " + forgotPasswordRequest.getEmail());
        });
        try {
            user.setStatus("PASSWORD_RENEW");
            userRepository.save(user);
            emailService.sendHtmlEmailForgotPassword(user);
            return ForgotPasswordResponse.builder()
                    .email(user.getEmail())
                    .password(user.getPassword())
                    .build();
        } catch (MessagingException e) {
            throw new RuntimeException(e);
        }
    }


    public User getUserById(String id) {
        return userRepository.findById(id).orElseThrow(() -> {
            throw new RuntimeException("User with id: " + id + " was not found");
        });
    }

    public UpdatePasswordResponse updatePassword(UpdatePasswordRequest updatePasswordRequest, String userId) {
        if(updatePasswordRequest.getPassword().equals(updatePasswordRequest.getConfirmPassword())){
            User user = userRepository.findById(userId).orElseThrow(() -> {
                throw new RuntimeException("No user found with id: " + userId);
            });
            user.setPassword(passwordEncoder.encode(updatePasswordRequest.getPassword()));
            user.setStatus("OFFLINE");
            userRepository.save(user);
            return UpdatePasswordResponse.builder()
                    .message("Password has been successfully updated")
                    .user(user)
                    .build();
        } else {
            return UpdatePasswordResponse.builder()
                    .message("Passwords are not matching")
                    .user(null)
                    .build();
        }
    }
}
