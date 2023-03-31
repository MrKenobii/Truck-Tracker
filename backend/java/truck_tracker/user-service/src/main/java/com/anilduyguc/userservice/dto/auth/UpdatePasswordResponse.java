package com.anilduyguc.userservice.dto.auth;

import com.anilduyguc.userservice.modal.User;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UpdatePasswordResponse {
    private String message;
    private User user;
}
