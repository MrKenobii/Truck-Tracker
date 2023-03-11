package com.anilduyguc.userservice.service;

import com.anilduyguc.userservice.modal.City;
import com.anilduyguc.userservice.modal.User;

import java.util.List;

public interface CityService {
    List<City> getCities();
    City getCityById(String id);
    City getCityByName(String cityName);
    City createCity(City city);
    City updateCity(String id, City city);
    void deleteCity(String id);
    List<User> getUsersByCityId(String id);
}
