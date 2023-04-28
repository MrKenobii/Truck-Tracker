package com.anilduyguc.userservice.service.impl;

import com.anilduyguc.userservice.config.TwilioConfig;
import com.anilduyguc.userservice.dto.TwilioOTPResponse;
import com.anilduyguc.userservice.modal.User;
import com.anilduyguc.userservice.service.TwilioService;
import com.twilio.rest.api.v2010.account.Message;
import com.twilio.type.PhoneNumber;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class TwilioServiceImpl implements TwilioService {
    private final TwilioConfig twilioConfig;
    @Override
    public void sendRegistrationInfo(User user) {
        try {
            String phone;
            if(user.getPhoneNumber().startsWith("+90")){
                phone = user.getPhoneNumber();
            } else {
                phone = "+90" + user.getPhoneNumber();
            }
            System.out.println("Tel no: " + phone);
            Message.creator(new PhoneNumber(phone),
                    new PhoneNumber(twilioConfig.getTrialNumber()), "Sayın " + user.getName() + " " + user.getLastName() +
                            " Tır Takip Uygulumasına kaydolduğunuz için teşekkur ederiz. Doğrulama Kodunuz "+ user.getSmsActivationToken()).create();
        } catch (Exception e){
            e.printStackTrace();
        }

    }
}
