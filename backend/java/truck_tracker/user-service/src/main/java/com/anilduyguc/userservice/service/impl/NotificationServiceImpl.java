package com.anilduyguc.userservice.service.impl;

import com.anilduyguc.userservice.dto.notification.SaveNotificationRequest;
import com.anilduyguc.userservice.dto.notification.SaveNotificationResponse;
import com.anilduyguc.userservice.dto.notification.SendNotificationRequest;
import com.anilduyguc.userservice.dto.notification.SendNotificationResponse;
import com.anilduyguc.userservice.dto.user.UserRequest;
import com.anilduyguc.userservice.modal.Notification;
import com.anilduyguc.userservice.modal.User;
import com.anilduyguc.userservice.repository.NotificationRepository;
import com.anilduyguc.userservice.repository.UserRepository;
import com.anilduyguc.userservice.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class NotificationServiceImpl implements NotificationService {
    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;

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
        notificationToUpdate.setUsers(notification.getUsers());
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

    @Override
    public SendNotificationResponse sendNotifications(String id, SendNotificationRequest notificationRequest) {
        User sender = userRepository.findById(id).orElseThrow(() -> {
            throw new RuntimeException("No user found with id " + id);
        });
        List<User> userList = new ArrayList<>();
        String notificationId = UUID.randomUUID().toString();
        for(UserRequest u: notificationRequest.getUsers()){
            User user = userRepository.findById(u.getId()).orElseThrow(() -> {
                throw new RuntimeException("Not found");
            });
            List<Notification> notifications = user.getNotifications();
            notifications.add(Notification.builder()
                    .content(notificationRequest.getContent())
                    .id(notificationId)
                    .emergencyLevel(notificationRequest.getEmergencyLevel())
                    .senderName(sender)
                    .build());
            user.setNotifications(notifications);
            userList.add(user);
            userRepository.save(user);
        }
        return SendNotificationResponse.builder()
                .users(userList)
                .content(notificationRequest.getContent())
                .emergencyLevel(notificationRequest.getEmergencyLevel())
                .build();
    }

    @Override
    public List<User> getUsersByNotification(String id) {
        Notification notification = notificationRepository.findById(id).orElseThrow(() -> {
            throw new RuntimeException("Notification with id: " + id + " was not found");
        });
        if(notification.getUsers().size() > 0 ){
            System.out.println(notification.getUsers().size());
        } else {
            System.out.println("NO SIZE");
        }
        return notification.getUsers();
    }

    @Override
    public SaveNotificationResponse saveNotification(String id, SaveNotificationRequest request) {
        User user = userRepository.findById(id).orElseThrow(() -> {
            throw new RuntimeException("No user found with id " + id);
        });
        User sender = userRepository.findById(request.getSender().getId()).orElseThrow(() -> {
            throw new RuntimeException("No user found with id " + request.getSender().getId());
        });
        List<User> userList = new ArrayList<>();

        List<Notification> notifications = user.getNotifications();
        Notification notification= Notification.builder()
                .content(request.getContent())
                .id(request.getId())
                .emergencyLevel(request.getEmergencyLevel())
                .senderName(sender)
                .build();
        notifications.add(notification);
        user.setNotifications(notifications);
        userList.add(user);
        userRepository.save(user);

        return SaveNotificationResponse.builder()
                .sender(sender)
                .emergencyLevel(notification.getEmergencyLevel())
                .content(notification.getContent())
                .id(notification.getId())
                .message("Success")
                .build();
    }


}
