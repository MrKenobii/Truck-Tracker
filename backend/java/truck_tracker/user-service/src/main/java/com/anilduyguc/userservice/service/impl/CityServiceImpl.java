package com.anilduyguc.userservice.service.impl;

import com.anilduyguc.userservice.dto.city.CityRequirementRequest;
import com.anilduyguc.userservice.modal.City;
import com.anilduyguc.userservice.modal.User;
import com.anilduyguc.userservice.repository.CityRepository;
import com.anilduyguc.userservice.service.CityService;
import lombok.RequiredArgsConstructor;
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
        return cityRepository.findById(id).orElseThrow(() -> new RuntimeException("City with id: " + id + " does not found"));
    }

    @Override
    public City getCityByName(String cityName) {
        return cityRepository.findCitiesByName(cityName).orElseThrow(() -> new RuntimeException("City with name: " + cityName + " does not found"));
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
        City cityToUpdate = cityRepository.findById(id).orElseThrow(() -> new RuntimeException("City with id: " + id + " does not found"));
        cityToUpdate.setName(city.getName());
        cityToUpdate.setLatitude(city.getLatitude());
        cityToUpdate.setLongitude(city.getLongitude());
        cityToUpdate.setUrgency(city.getUrgency());
        cityToUpdate.setPopulation(city.getPopulation());
        cityToUpdate.setFood(city.getFood());
        cityToUpdate.setClothing(city.getClothing());
        cityToUpdate.setWater(city.getWater());
        cityToUpdate.setTent(city.getTent());
        cityRepository.save(cityToUpdate);
        return cityToUpdate;
    }

    @Override
    public void deleteCity(String id) {
        City city = cityRepository.findById(id).orElseThrow(() -> new RuntimeException("City with id: " + id + " does not found"));
        cityRepository.delete(city);
    }

    @Override
    public List<User> getUsersByCityId(String id) {
        City city = cityRepository.findById(id).orElseThrow(() -> new RuntimeException("Does not found"));
        return city.getUsers();
    }

    @Override
    public City setRequirements(String id, CityRequirementRequest cityRequirementRequest) {
        City city = cityRepository.findById(id).orElseThrow(() -> new RuntimeException("City with id: " + id + " does not found"));
        city.setTent(cityRequirementRequest.getTent());
        city.setWater(cityRequirementRequest.getWater());
        city.setClothing(cityRequirementRequest.getClothing());
        city.setFood(cityRequirementRequest.getFood());
        return cityRepository.save(city);
    }

    @Override
    public List<City> setAllRequirements() {
        List<City> cities = cityRepository.findAll();
        for (City city : cities) {
            int randomNumberForWater;
            int randomNumberForFood;
            int randomNumberForTent;
            int randomNumberForClothing;
            if (city.getUrgency() > 3) {
                randomNumberForWater = (int) Math.floor(Math.random() * (250 - 150 + 1) + 150);
                randomNumberForFood = (int) Math.floor(Math.random() * (250 - 150 + 1) + 150);
                randomNumberForTent = (int) Math.floor(Math.random() * (150 - 100 + 1) + 100);
                randomNumberForClothing = (int) Math.floor(Math.random() * (2500 - 1500 + 1) + 1500);

            } else {
                randomNumberForWater = (int) Math.floor(Math.random() * (150 - 50 + 1) + 50);
                randomNumberForFood = (int) Math.floor(Math.random() * (150 - 50 + 1) + 50);
                randomNumberForTent = (int) Math.floor(Math.random() * (50 - 20 + 1) + 20);
                randomNumberForClothing = (int) Math.floor(Math.random() * (1000 - 500 + 1) + 500);
            }
            city.setTent(randomNumberForTent);
            city.setWater(randomNumberForWater);
            city.setClothing(randomNumberForClothing);
            city.setFood(randomNumberForFood);
            cityRepository.save(city);
        }
        return cities;
    }
}
