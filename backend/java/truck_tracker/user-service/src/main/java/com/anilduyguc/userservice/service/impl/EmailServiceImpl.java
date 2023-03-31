package com.anilduyguc.userservice.service.impl;

import com.anilduyguc.userservice.modal.User;
import com.anilduyguc.userservice.service.EmailService;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.InternetAddress;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailServiceImpl implements EmailService {
    private final JavaMailSender mailSender;

    public void sendEmail(String to, String subject, String body) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject(subject);
        message.setText(body);
        mailSender.send(message);
    }
    public void sendHtmlEmailForgotPassword(User user) throws MessagingException {
        MimeMessage message = mailSender.createMimeMessage();

        message.setFrom(new InternetAddress("anilduyguc3535@gmail.com"));
        message.setRecipients(MimeMessage.RecipientType.TO, user.getEmail());
        message.setSubject("Şifre Yenileme İsteğiniz");

        String htmlContent = "<h1>Şifre Yenileme İsteğiniz</h1>" +
                "<p>Aşağıdaki linke tıklayarak şifrenizi yenileyebilirsiniz</p>" +
                "<a href=\"http://localhost:3000/update-password/" + user.getId() + "\">Şifre Yenile</a>";
        message.setContent(htmlContent, "text/html; charset=utf-8");

        mailSender.send(message);
    }
}
