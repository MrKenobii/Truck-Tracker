package com.anilduyguc.userservice.repository;

import com.anilduyguc.userservice.modal.Truck;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TruckRepository extends JpaRepository<Truck, String> {
}
