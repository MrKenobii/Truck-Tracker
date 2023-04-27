package com.anilduyguc.userservice.dto.auth;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ActivateAccountRequest {
    private String activationToken;
    private boolean isAdmin;
}
