package com.anilduyguc.userservice.service;

import com.anilduyguc.userservice.dto.notification.SendNotificationRequest;
import com.anilduyguc.userservice.dto.notification.SendNotificationResponse;
import com.anilduyguc.userservice.modal.Notification;
import com.anilduyguc.userservice.modal.User;

import java.util.List;

public interface NotificationService {
    List<Notification> getNotifications();
    Notification getNotificationById(String id);
    Notification createNotification(Notification notification);
    Notification updateNotification(String id, Notification notification);
    void deleteNotification(String id);
    SendNotificationResponse sendNotifications(SendNotificationRequest notificationRequest);

    List<User> getUsersByNotification(String id);
}
