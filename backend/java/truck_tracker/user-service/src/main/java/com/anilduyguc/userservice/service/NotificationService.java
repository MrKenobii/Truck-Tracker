package com.anilduyguc.userservice.service;

import com.anilduyguc.userservice.modal.Notification;

import java.util.List;

public interface NotificationService {
    List<Notification> getNotifications();
    Notification getNotificationById(String id);
    Notification createNotification(Notification notification);
    Notification updateNotification(String id, Notification notification);
    void deleteNotification(String id);
}
