package com.anilduyguc.userservice.dto.notification;

import com.anilduyguc.userservice.dto.user.UserRequest;
import com.anilduyguc.userservice.modal.User;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
public class SendNotificationRequest {
    private String id;
    private String content;
    private Integer emergencyLevel;
    private List<UserRequest> users;
}
