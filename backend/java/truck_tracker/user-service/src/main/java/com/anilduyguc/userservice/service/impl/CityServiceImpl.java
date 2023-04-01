package com.anilduyguc.userservice.service.impl;

import com.anilduyguc.userservice.dto.city.CityRequirementRequest;
import com.anilduyguc.userservice.modal.City;
import com.anilduyguc.userservice.modal.Truck;
import com.anilduyguc.userservice.modal.User;
import com.anilduyguc.userservice.repository.CityRepository;
import com.anilduyguc.userservice.repository.TruckRepository;
import com.anilduyguc.userservice.service.CityService;
import com.anilduyguc.userservice.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.ArrayList;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
@RequiredArgsConstructor
public class CityServiceImpl implements CityService {
    private final CityRepository cityRepository;
    private final TruckRepository truckRepository;

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
        cityToUpdate.setRequirementList(city.getRequirementList());
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

    @Override
    public City setRequirements(String id, CityRequirementRequest cityRequirementRequest) {
        City city = cityRepository.findById(id).orElseThrow(() -> {
            throw new RuntimeException("City with id: " + id + " does not found");
        });
        city.setRequirementList(cityRequirementRequest.getRequirementList());
        return cityRepository.save(city);
    }

    @Override
    public List<City> setAllRequirements() {
        List<City> cities = cityRepository.findAll();
        for(int i = 0; i < cities.size(); i++){
            City city = cities.get(i);
            String s = "";
            if(city.getUrgency() > 3){

                int randomNumberForWater = (int)Math.floor(Math.random() * (250 - 150 + 1) + 150);
                int randomNumberForFood = (int)Math.floor(Math.random() * (250 - 150 + 1) + 150);
                int randomNumberForTent = (int)Math.floor(Math.random() * (150 - 100 + 1) + 100);
                int randomNumberForClothing = (int)Math.floor(Math.random() * (2500 - 1500 + 1) + 1500);
                s = randomNumberForWater + " L su, " + randomNumberForFood + " kg yiyecek, " + randomNumberForTent + " çadır, " + randomNumberForClothing + " kişilik kıyafet";
                city.setRequirementList(s);
                cityRepository.save(city);

            } else {
                int randomNumberForWater = (int)Math.floor(Math.random() * (150 - 50 + 1) + 50);
                int randomNumberForFood = (int)Math.floor(Math.random() * (150 - 50 + 1) + 50);
                int randomNumberForTent = (int)Math.floor(Math.random() * (50 - 20 + 1) + 20);
                int randomNumberForClothing = (int)Math.floor(Math.random() * (1000 - 500 + 1) + 500);
                s = randomNumberForWater + " L su, " + randomNumberForFood + " kg yiyecek, " + randomNumberForTent + " çadır, " + randomNumberForClothing + " kişilik kıyafet";
                city.setRequirementList(s);
                cityRepository.save(city);
            }
        }
        return cities;
    }
}
