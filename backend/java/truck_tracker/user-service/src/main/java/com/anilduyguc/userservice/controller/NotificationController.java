package com.anilduyguc.userservice.controller;


import com.anilduyguc.userservice.dto.notification.SaveNotificationRequest;
import com.anilduyguc.userservice.dto.notification.SaveNotificationResponse;
import com.anilduyguc.userservice.dto.notification.SendNotificationRequest;
import com.anilduyguc.userservice.dto.notification.SendNotificationResponse;
import com.anilduyguc.userservice.modal.Notification;
import com.anilduyguc.userservice.modal.User;
import com.anilduyguc.userservice.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/notification")
@RequiredArgsConstructor
public class NotificationController {
    private final NotificationService notificationService;

    @GetMapping
    public ResponseEntity<List<Notification>> getNotifications(){
        return new ResponseEntity<>(notificationService.getNotifications(), HttpStatus.OK);
    }
    @GetMapping("/{id}")
    public ResponseEntity<Notification> getNotificationById(@PathVariable String id){
        return new ResponseEntity<>(notificationService.getNotificationById(id), HttpStatus.OK);
    }
    @GetMapping("/{id}/user")
    public ResponseEntity<List<User>> getUsersByNotification(@PathVariable String id){
        System.out.println("HEREE");
        return new ResponseEntity<>(notificationService.getUsersByNotification(id), HttpStatus.OK);
    }
    @GetMapping("/by-user/{userId}")
    public ResponseEntity<List<Notification>> getNotificationByUserId(@PathVariable String userId){
        return new ResponseEntity<>(notificationService.getNotificationByUserId(userId), HttpStatus.CREATED);
    }
    @PostMapping
    public ResponseEntity<Notification> createNotification(@RequestBody Notification notification){
        return new ResponseEntity<>(notificationService.createNotification(notification), HttpStatus.CREATED);
    }
    @PostMapping("/{id}/send")
    public ResponseEntity<SendNotificationResponse> sendNotificationToUsers(@PathVariable String id, @RequestBody SendNotificationRequest notificationRequest){
        return new ResponseEntity<>(notificationService.sendNotifications(id, notificationRequest), HttpStatus.OK);
    }
    @PostMapping("/{id}/save")
    public ResponseEntity<SaveNotificationResponse> saveNotification(@PathVariable String id, @RequestBody SaveNotificationRequest request){
        return new ResponseEntity<>(notificationService.saveNotification(id, request), HttpStatus.OK);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Notification> updateNotification(@PathVariable String id, @RequestBody Notification notification){
        return new ResponseEntity<>(notificationService.updateNotification(id, notification), HttpStatus.OK);
    }
    @DeleteMapping("/{id}/user/{userId}")
    public void deleteNotification(@PathVariable String  id, @PathVariable String userId){
        notificationService.deleteNotification(id, userId);
    }
}
