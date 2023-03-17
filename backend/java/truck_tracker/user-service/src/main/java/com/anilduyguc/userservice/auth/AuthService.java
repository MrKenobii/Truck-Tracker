package com.anilduyguc.userservice.auth;

import com.anilduyguc.userservice.config.JwtService;
import com.anilduyguc.userservice.dto.auth.AuthenticationRequest;
import com.anilduyguc.userservice.dto.auth.AuthenticationResponse;
import com.anilduyguc.userservice.dto.auth.RegisterRequest;
import com.anilduyguc.userservice.modal.City;
import com.anilduyguc.userservice.modal.Role;
import com.anilduyguc.userservice.modal.User;
import com.anilduyguc.userservice.repository.CityRepository;
import com.anilduyguc.userservice.repository.RoleRepository;
import com.anilduyguc.userservice.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

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

    public AuthenticationResponse register(RegisterRequest registerRequest) {
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
                .build();
    }

    public AuthenticationResponse authenticate(AuthenticationRequest authenticationRequest) {
        authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(authenticationRequest.getEmail(), authenticationRequest.getPassword()));
        var user = userRepository.findUserByEmail(authenticationRequest.getEmail()).orElseThrow(() -> new RuntimeException("No user found"));
        var jwt = jwtService.generateToken(user);
        user.setToken(jwt);
        userRepository.save(user);
        return AuthenticationResponse.builder()
                .token(jwt)
                .build();
    }
}
