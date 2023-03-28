package com.anilduyguc.userservice.dto.notification;

import com.anilduyguc.userservice.modal.User;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
public class SaveNotificationResponse {
    private String id;
    private String content;
    private Integer emergencyLevel;
    private User sender;
    private String message;
}
