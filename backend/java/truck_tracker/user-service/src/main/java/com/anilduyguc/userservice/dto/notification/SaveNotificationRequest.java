package com.anilduyguc.userservice.dto.notification;


import com.anilduyguc.userservice.modal.User;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.Date;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
public class SaveNotificationRequest {
    private String id;
    private String content;
    private Integer emergencyLevel;
    private String senderId;
//    private LocalDateTime createdAt;

}
