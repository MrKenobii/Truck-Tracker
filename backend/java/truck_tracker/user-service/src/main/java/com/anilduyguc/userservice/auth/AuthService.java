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
import com.anilduyguc.userservice.service.TwilioService;
import jakarta.mail.MessagingException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.text.DecimalFormat;
import java.util.Optional;
import java.util.Random;
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
    private final TwilioService twilioService;

    public AuthenticationResponse register(RegisterRequest registerRequest) {
        Optional<User> userByEmail = userRepository.findUserByEmail(registerRequest.getEmail());
        if(userByEmail.isPresent()){
            return AuthenticationResponse.builder().token(null).message("Bu email adresiyle kayıtlı kullanıcı zaten var.").userId(null).build();
        } else {
            City city = cityRepository.findCitiesByName(registerRequest.getCity()).orElseThrow(() -> new RuntimeException("No city found with name " + registerRequest.getCity()));
            Role role = roleRepository.findByName(registerRequest.getRole()).orElseThrow(() -> new RuntimeException("No role found with name " + registerRequest.getRole()));
            String smsActivationToken = this.generateOTP();
            String emailActivationToken = this.generateOTP();
            var user = User.builder()
                    .id(UUID.randomUUID().toString())
                    .isAccountActive(false)
                    .status("INACTIVE")
                    .phoneNumber(registerRequest.getPhoneNumber())
                    .city(city)
                    .token(null)
                    .name(registerRequest.getFirstName())
                    .lastName(registerRequest.getLastName())
                    .email(registerRequest.getEmail())
                    .accountActivationToken(emailActivationToken)
                    .smsActivationToken(smsActivationToken)
                    .password(passwordEncoder.encode(registerRequest.getPassword()))
                    .role(role)
                    .build();
            twilioService.sendRegistrationInfo(user);
            try {
                emailService.sendHtmlEmailActivateAccount(user);
            } catch (MessagingException e) {
                throw new RuntimeException(e);
            }
            userRepository.save(user);
            return AuthenticationResponse.builder()
                    .token(null)
                    .userId(user.getId())
                    .message("Kayıt olma işlemi başarılı. Lütfen posta kutunuzu kontrol edin.")
                    .build();
        }
    }
    private String generateOTP(){
        return new DecimalFormat("000000").format(new Random().nextInt(999999));
    }
    public ActivateAccountResponse activateAccount(String userId, ActivateAccountRequest request){
        User userById = this.getUserById(userId);
        if(!userById.isAccountActive()){
            if((request.getActivationToken().equals(userById.getAccountActivationToken()) && request.getActivationSmsToken().equals(userById.getSmsActivationToken()))){
                var jwt = jwtService.generateToken(userById);
                userById.setToken(jwt);
                userById.setAccountActive(true);
                userById.setAccountActivationToken(null);
                userById.setSmsActivationToken(null);
                System.out.println(request);
                if(request.isAdmin()) userById.setStatus("OFFLINE");
                else userById.setStatus("ONLINE");
                userRepository.save(userById);
                try {
                    emailService.sendActivationSuccessEmail(userById);
                } catch (MessagingException e) {
                    throw new RuntimeException(e);
                }
                return ActivateAccountResponse.builder()
                        .token(jwt)
                        .message("Hesabınız başarışıyla aktifleştirildi.")
                        .user(userById)
                        .build();
            } else {
                return ActivateAccountResponse.builder()
                        .token(null)
                        .message("Aktivasyon kodları hatalı.")
                        .user(null)
                        .build();
            }
        } else {
            return ActivateAccountResponse.builder()
                    .token(null)
                    .message("Hesap zaten aktive edilmiş.")
                    .user(null)
                    .build();
        }
    }

    public AuthenticationResponse authenticate(AuthenticationRequest authenticationRequest) {
        authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(authenticationRequest.getEmail(), authenticationRequest.getPassword()));
        var user = userRepository.findUserByEmail(authenticationRequest.getEmail()).orElseThrow(() -> new RuntimeException("No user found"));
        var jwt = jwtService.generateToken(user);
        if(user.isAccountActive()){
            if(user.getStatus().equals("OFFLINE")){
                user.setToken(jwt);
                user.setStatus("ONLINE");
                userRepository.save(user);

                return AuthenticationResponse.builder()
                        .token(jwt)
                        .message("Giriş başarılı")
                        .userId(user.getId())
                        .build();
            } else {
                return AuthenticationResponse.builder()
                        .token(null)
                        .message("Giriş yapabilmek için diğer cihazlardan çıkış yapmalısınız.")
                        .build();
            }
        } else {
            try {
                emailService.sendHtmlEmailActivateAccount(user);
            } catch (MessagingException e) {
                throw new RuntimeException(e);
            }
            return AuthenticationResponse.builder()
                    .token(null)
                    .message("Hesabınız aktif değil. Lütfen posta kutunuzu kontrol edin.")
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
        return userRepository.findById(id).orElseThrow(() -> new RuntimeException("User with id: " + id + " was not found"));
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
