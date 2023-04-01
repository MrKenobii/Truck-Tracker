package com.anilduyguc.userservice.repository;

import com.anilduyguc.userservice.modal.Truck;
import com.anilduyguc.userservice.modal.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface TruckRepository extends JpaRepository<Truck, String> {
    Optional<Truck> findTruckByUser(User u);
}
