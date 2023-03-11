package com.anilduyguc.userservice.controller;

import com.anilduyguc.userservice.modal.City;
import com.anilduyguc.userservice.modal.User;
import com.anilduyguc.userservice.service.CityService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/city")
@RequiredArgsConstructor
public class CityController {
    @Autowired
    private final CityService cityService;
    @GetMapping
    public ResponseEntity<?> getCityByNameOrAll(@RequestParam(required = false) String name){
        if(name != null){
            return new ResponseEntity<>(cityService.getCityByName(name), HttpStatus.OK);
        } else {
            return new ResponseEntity<>(cityService.getCities(), HttpStatus.OK);
        }
    }
    @GetMapping("/{id}")
    public ResponseEntity<City> getCityById(@PathVariable String id){
        return new ResponseEntity<>(cityService.getCityById(id), HttpStatus.OK);
    }
    @PostMapping
    public ResponseEntity<City> createCity(@RequestBody City city){
        return new ResponseEntity<>(cityService.createCity(city), HttpStatus.CREATED);
    }
    @PutMapping("/{id}")
    public ResponseEntity<City> updateCity(@PathVariable String id, @RequestBody City city){
        return new ResponseEntity<>(cityService.updateCity(id, city), HttpStatus.OK);
    }
    @DeleteMapping("/{id}")
    public void deleteCity(@PathVariable String id){
        cityService.deleteCity(id);
    }
    @GetMapping("/{id}/user")
    public ResponseEntity<List<User>> getUsersByCityName(@PathVariable String id){
        return new ResponseEntity<>(cityService.getUsersByCityId(id), HttpStatus.OK);
    }
}
