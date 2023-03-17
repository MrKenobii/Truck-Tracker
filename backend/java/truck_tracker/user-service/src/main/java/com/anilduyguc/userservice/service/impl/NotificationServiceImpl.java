package com.anilduyguc.userservice.service.impl;

import com.anilduyguc.userservice.modal.Notification;
import com.anilduyguc.userservice.repository.NotificationRepository;
import com.anilduyguc.userservice.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class NotificationServiceImpl implements NotificationService {
    private final NotificationRepository notificationRepository;

    @Override
    public List<Notification> getNotifications() {
        return notificationRepository.findAll();
    }

    @Override
    public Notification getNotificationById(String id) {
        return notificationRepository.findById(id).orElseThrow(() -> {
            throw new RuntimeException("Notification with id: " + id + " was not found");
        });
    }

    @Override
    public Notification createNotification(Notification notification) {
        String id = UUID.randomUUID().toString();
        notification.setId(id);
        notificationRepository.save(notification);
        return notification;
    }

    @Override
    public Notification updateNotification(String id, Notification notification) {
        Notification notificationToUpdate = notificationRepository.findById(id).orElseThrow(() -> {
            throw new RuntimeException("Notification with id: " + id + " was not found");
        });
        notificationToUpdate.setContent(notification.getContent());
        notificationToUpdate.setEmergencyLevel(notification.getEmergencyLevel());
        notificationToUpdate.setUser(notification.getUser());
        notificationRepository.save(notificationToUpdate);
        return notificationToUpdate;
    }

    @Override
    public void deleteNotification(String id) {
        Notification notification = notificationRepository.findById(id).orElseThrow(() -> {
            throw new RuntimeException("Notification with id: " + id + " was not found");
        });
        notificationRepository.delete(notification);
    }
}
