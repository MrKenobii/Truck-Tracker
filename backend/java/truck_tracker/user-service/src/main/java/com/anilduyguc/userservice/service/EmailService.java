package com.anilduyguc.userservice.service;

import com.anilduyguc.userservice.modal.User;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.AddressException;

public interface EmailService {
    void sendEmail(String to, String subject, String body);
    void sendHtmlEmailForgotPassword(User user) throws MessagingException;

    void sendHtmlEmailActivateAccount(User user) throws MessagingException;
}
