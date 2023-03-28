package com.anilduyguc.userservice.service;

import com.anilduyguc.userservice.dto.notification.SaveNotificationRequest;
import com.anilduyguc.userservice.dto.notification.SaveNotificationResponse;
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
    SendNotificationResponse sendNotifications(String id, SendNotificationRequest notificationRequest);

    List<User> getUsersByNotification(String id);

    SaveNotificationResponse saveNotification(String id, SaveNotificationRequest request);
}
