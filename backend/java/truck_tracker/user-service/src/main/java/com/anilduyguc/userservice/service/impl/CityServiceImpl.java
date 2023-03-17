package com.anilduyguc.userservice.service.impl;

import com.anilduyguc.userservice.modal.City;
import com.anilduyguc.userservice.modal.User;
import com.anilduyguc.userservice.repository.CityRepository;
import com.anilduyguc.userservice.service.CityService;
import com.anilduyguc.userservice.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class CityServiceImpl implements CityService {
    private final CityRepository cityRepository;

    @Override
    public List<City> getCities() {
        return cityRepository.findAll();
    }

    @Override
    public City getCityById(String id) {
        return cityRepository.findById(id).orElseThrow(() -> {
            throw new RuntimeException("City with id: " + id + " does not found");
        });
    }

    @Override
    public City getCityByName(String cityName) {
        return cityRepository.findCitiesByName(cityName).orElseThrow(() -> {
            throw new RuntimeException("City with name: " + cityName + " does not found");
        });
    }

    @Override
    public City createCity(City city) {
        String id = UUID.randomUUID().toString();
        city.setId(id);
        cityRepository.save(city);
        return city;
    }

    @Override
    public City updateCity(String id, City city) {
        City cityToUpdate = cityRepository.findById(id).orElseThrow(() -> {
            throw new RuntimeException("City with id: " + id + " does not found");
        });
        cityToUpdate.setName(city.getName());
        cityToUpdate.setLatitude(city.getLatitude());
        cityToUpdate.setLongitude(city.getLongitude());
        cityToUpdate.setUrgency(city.getUrgency());
        cityToUpdate.setPopulation(city.getPopulation());
        cityRepository.save(cityToUpdate);
        return cityToUpdate;
    }

    @Override
    public void deleteCity(String id) {
        City city = cityRepository.findById(id).orElseThrow(() -> {
            throw new RuntimeException("City with id: " + id + " does not found");
        });
        cityRepository.delete(city);
    }

    @Override
    public List<User> getUsersByCityId(String id) {
        City city = cityRepository.findById(id).orElseThrow(() -> {
            throw new RuntimeException("Does not found");
        });
        return city.getUsers();
    }
}
