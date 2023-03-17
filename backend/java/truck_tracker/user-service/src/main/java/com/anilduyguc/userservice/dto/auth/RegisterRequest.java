package com.anilduyguc.userservice.dto.auth;

import com.anilduyguc.userservice.modal.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class RegisterRequest {
    private String firstName;
    private String lastName;
    private String email;
    public String phoneNumber;
    private String city;
    private String role;
    private String password;
}
