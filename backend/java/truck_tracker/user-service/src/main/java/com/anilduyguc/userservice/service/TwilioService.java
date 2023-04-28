package com.anilduyguc.userservice.service;

import com.anilduyguc.userservice.modal.User;

public interface TwilioService {
    void sendRegistrationInfo(User user);
}
