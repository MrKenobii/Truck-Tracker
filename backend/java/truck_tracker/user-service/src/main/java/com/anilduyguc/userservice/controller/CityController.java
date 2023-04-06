package com.anilduyguc.userservice.controller;

import com.anilduyguc.userservice.dto.city.CityRequirementRequest;
import com.anilduyguc.userservice.modal.City;
import com.anilduyguc.userservice.modal.User;
import com.anilduyguc.userservice.service.CityService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/city")
@CrossOrigin(origins = "http://localhost:3000", maxAge = 3600)
@RequiredArgsConstructor
public class CityController {
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
    @PutMapping("/{id}/list")
    public ResponseEntity<City> setRequirementList(@PathVariable String id, @RequestBody CityRequirementRequest cityRequirementRequest){
        return new ResponseEntity<>(cityService.setRequirements(id, cityRequirementRequest), HttpStatus.OK);
    }
    @PutMapping("/list")
    public ResponseEntity<List<City>> setAllRequirementsList(){
        return new ResponseEntity<>(cityService.setAllRequirements(), HttpStatus.OK);
    }
}
