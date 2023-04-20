package com.anilduyguc.userservice.dto.notification;

import com.anilduyguc.userservice.modal.User;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
public class SaveNotificationResponse {
    private String id;
    private String content;
    private Integer emergencyLevel;
    private String senderId;
    private String message;
    private LocalDateTime createdAt;
}
