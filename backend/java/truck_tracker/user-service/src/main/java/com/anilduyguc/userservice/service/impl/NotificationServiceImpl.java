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
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
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
        return notificationRepository.findById(id).orElseThrow(() -> new RuntimeException("Notification with id: " + id + " was not found"));
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
        Notification notificationToUpdate = notificationRepository.findById(id).orElseThrow(() -> new RuntimeException("Notification with id: " + id + " was not found"));
        notificationToUpdate.setContent(notification.getContent());
        notificationToUpdate.setEmergencyLevel(notification.getEmergencyLevel());
        notificationToUpdate.setUsers(notification.getUsers());
        notificationRepository.save(notificationToUpdate);
        return notificationToUpdate;
    }

    @Override
    @Transactional
    public void deleteNotification(String id, String userId) {
        //User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("No user found with id: " + userId));
        Notification notification = notificationRepository.findById(id).orElseThrow(() -> new RuntimeException("Notification with id: " + id + " was not found"));

        for(User u : notification.getUsers()){
            u.getNotifications().remove(notification);
        }

        //notificationRepository.delete(notification);


    }

    @Override
    public SendNotificationResponse sendNotifications(String id, SendNotificationRequest notificationRequest) {
        User sender = userRepository.findById(id).orElseThrow(() -> new RuntimeException("No user found with id " + id));
        List<User> userList = new ArrayList<>();
        String notificationId = UUID.randomUUID().toString();
        for(UserRequest u: notificationRequest.getUsers()){
            User user = userRepository.findById(u.getId()).orElseThrow(() -> new RuntimeException("Not found"));
            List<Notification> notifications = user.getNotifications();
            notifications.add(Notification.builder()
                    .content(notificationRequest.getContent())
                    .id(notificationId)
                    .emergencyLevel(notificationRequest.getEmergencyLevel())
                    .createdAt(notificationRequest.getCreatedAt())
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
        Notification notification = notificationRepository.findById(id).orElseThrow(() -> new RuntimeException("Notification with id: " + id + " was not found"));
        if(notification.getUsers().size() > 0 ){
            System.out.println(notification.getUsers().size());
        } else {
            System.out.println("NO SIZE");
        }
        return notification.getUsers();
    }

    @Override
    public SaveNotificationResponse saveNotification(String id, SaveNotificationRequest request) {
        User user = userRepository.findById(id).orElseThrow(() -> new RuntimeException("No user found with id " + id));
        User sender = userRepository.findById(request.getSenderId()).orElseThrow(() -> new RuntimeException("No user found with id " + request.getSenderId()));
        //List<Notification> notifications = user.getNotifications();
        //List<Notification> notifications = new ArrayList<>();
        System.out.println("BEFORE " +user.getNotifications().size());
        Notification notification= Notification.builder()
                .content(request.getContent())
                .id(request.getId())
                .emergencyLevel(request.getEmergencyLevel())
                .senderName(sender)
                .createdAt(LocalDateTime.now())
                .build();

        //notifications.add(notification);
        user.getNotifications().add(notification);
        System.out.println("AFTER: " + user.getNotifications().size());
        userRepository.save(user);

        return SaveNotificationResponse.builder()
                .senderId(sender.getId())
                .emergencyLevel(notification.getEmergencyLevel())
                .content(notification.getContent())
                .id(notification.getId())
                .createdAt(notification.getCreatedAt())
                .message("Success")
                .build();
    }

    @Override
    public List<Notification> getNotificationByUserId(String userId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("No user found with id " + userId));
        return user.getNotifications();
    }


}
