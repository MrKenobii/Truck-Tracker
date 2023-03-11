package com.anilduyguc.userservice.controller;


import com.anilduyguc.userservice.modal.Notification;
import com.anilduyguc.userservice.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/notification")
@RequiredArgsConstructor
public class NotificationController {
    @Autowired
    private final NotificationService notificationService;

    @GetMapping
    public ResponseEntity<List<Notification>> getNotifications(){
        return new ResponseEntity<>(notificationService.getNotifications(), HttpStatus.OK);
    }
    @GetMapping("/{id}")
    public ResponseEntity<Notification> getNotificationById(@PathVariable String id){
        return new ResponseEntity<>(notificationService.getNotificationById(id), HttpStatus.OK);
    }
    @PostMapping
    public ResponseEntity<Notification> createNotification(@RequestBody Notification notification){
        return new ResponseEntity<>(notificationService.createNotification(notification), HttpStatus.CREATED);
    }
    @PutMapping("/{id}")
    public ResponseEntity<Notification> updateNotification(@PathVariable String id, @RequestBody Notification notification){
        return new ResponseEntity<>(notificationService.updateNotification(id, notification), HttpStatus.OK);
    }
    @DeleteMapping("/{id}")
    public void deleteNotification(@PathVariable String  id){
        notificationService.deleteNotification(id);
    }
}
