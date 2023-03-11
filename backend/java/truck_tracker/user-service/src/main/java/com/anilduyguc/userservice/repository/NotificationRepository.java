package com.anilduyguc.userservice.repository;

import com.anilduyguc.userservice.modal.Notification;
import org.springframework.data.jpa.repository.JpaRepository;

public interface NotificationRepository extends JpaRepository<Notification, String> {
}
