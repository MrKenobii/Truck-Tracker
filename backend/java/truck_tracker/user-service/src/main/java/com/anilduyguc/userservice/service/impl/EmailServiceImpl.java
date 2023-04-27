package com.anilduyguc.userservice.service.impl;

import com.anilduyguc.userservice.modal.User;
import com.anilduyguc.userservice.service.EmailService;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.AddressException;
import jakarta.mail.internet.InternetAddress;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
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

        String htmlContent = "<h1>Tır Takip Uygulamasında Şifre Yenileme İsteğiniz</h1>" +
                "<p>Sayın "+ user.getName()+ " " + user.getLastName() + ", email adresi "+user.getEmail() +" adlı hesabınıza ilişkin şifre yenileme isteği alınmıştır." +
                " Aşağıdaki linke tıklayarak şifrenizi yenileyebilirsiniz</p>" +
                "<a href=\"http://localhost:3000/update-password/" + user.getId() + "\">Şifre Yenile</a>";
        message.setContent(htmlContent, "text/html; charset=utf-8");

        mailSender.send(message);
    }

    @Override
    public void sendHtmlEmailActivateAccount(User user) throws MessagingException {
        MimeMessage message = mailSender.createMimeMessage();

        message.setFrom(new InternetAddress("anilduyguc3535@gmail.com"));
        message.setRecipients(MimeMessage.RecipientType.TO, user.getEmail());
        message.setSubject("Hesap Aktifleştirme İsteğiniz");

        String htmlContent = "<h1>Tır Takip Uygulamasında Hesap Aktifleştirme İşleminiz</h1>" +
                "<p>Sayın "+ user.getName()+ " " + user.getLastName() + ", email adresi "+user.getEmail() +" adlı hesabınıza ilişkin hesap aktive isteği alınmıştır." +
                " Aşağıdaki linke tıklayarak hesabınızı aktifleştirebilirsiniz.</p>" +
                "<p>Kodunuz: "+user.getAccountActivationToken()+"</p>"+
                "<a href=\"http://localhost:3000/activate-account/" + user.getId() + "\">Hesabınızı Aktive edin</a>";
        message.setContent(htmlContent, "text/html; charset=utf-8");

        mailSender.send(message);
    }

    @Override
    public void sendActivationSuccessEmail(User user) throws MessagingException {
        MimeMessage message = mailSender.createMimeMessage();

        message.setFrom(new InternetAddress("anilduyguc3535@gmail.com"));
        message.setRecipients(MimeMessage.RecipientType.TO, user.getEmail());
        message.setSubject("Hesabınız Başarıyla Aktifleştirildi");

        String htmlContent = "<h1>Tır Takip Uygulamasında Hesap Aktifleştirme İşleminiz</h1>" +
                "<p>Sayın "+ user.getName()+ " " + user.getLastName() + ", email adresi "+user.getEmail() +" adlı hesabınız hesabınız başarıyla aktifleştirilmiştir." +
                " Aşağıdaki linke tıklayarak giriş yapabilirsiniz.</p>" +
                "<a href=\"http://localhost:3000/login\">Giriş Yapın</a>";
        message.setContent(htmlContent, "text/html; charset=utf-8");

        mailSender.send(message);
    }
}
