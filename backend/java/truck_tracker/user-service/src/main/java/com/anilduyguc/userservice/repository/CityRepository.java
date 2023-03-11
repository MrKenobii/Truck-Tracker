package com.anilduyguc.userservice.repository;

import com.anilduyguc.userservice.modal.City;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CityRepository extends JpaRepository<City, String> {
    Optional<City> findCitiesByName(String name);
}
