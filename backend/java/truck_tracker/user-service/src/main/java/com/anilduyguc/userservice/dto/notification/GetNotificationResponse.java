package com.anilduyguc.userservice.dto.notification;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
public class GetNotificationResponse {
    private String id;
    private String content;
    private Integer emergencyLevel;
}
