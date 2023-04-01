package com.anilduyguc.userservice.controller;

import com.anilduyguc.userservice.dto.Location;
import com.anilduyguc.userservice.dto.truck.TruckSaveRequest;
import com.anilduyguc.userservice.modal.City;
import com.anilduyguc.userservice.modal.Truck;
import com.anilduyguc.userservice.service.TruckService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/truck")
@RequiredArgsConstructor
public class TruckController {
    private final TruckService truckService;
    @GetMapping
    public ResponseEntity<List<Truck>> getTrucks(){
        return new ResponseEntity<>(truckService.getAllTrucks(), HttpStatus.OK);
    }
    @GetMapping("/{id}")
    public ResponseEntity<Truck> getTruckById(@PathVariable String id){
        return new ResponseEntity<>(truckService.getTruckById(id), HttpStatus.OK);
    }
    @PostMapping
    public ResponseEntity<Truck> createTruck(@RequestBody TruckSaveRequest truckSaveRequest){
        return new ResponseEntity<>(truckService.createTruck(truckSaveRequest), HttpStatus.CREATED);
    }
    @PutMapping("/{id}")
    public ResponseEntity<Truck> updateTruck(@PathVariable String id, @RequestBody Truck truck){
        return new ResponseEntity<>(truckService.updateTruck(id, truck), HttpStatus.OK);
    }
    @DeleteMapping("/{id}")
    public void deleteTruck(@PathVariable String id){
        truckService.deleteTruck(id);
    }
    @GetMapping("/{id}/city")
    public ResponseEntity<City> getCityByTruck(@PathVariable String id, @RequestParam(required = false) String from,@RequestParam(required = false) String to, @RequestParam(required = false) String current){
        if(from != null){
            return new ResponseEntity<>(truckService.getFromCityByTruckId(id), HttpStatus.OK);
        } else if(to != null){
            return new ResponseEntity<>(truckService.getDestinationCityByTruckId(id), HttpStatus.OK);
        } else {
            return new ResponseEntity<>(new City(), HttpStatus.NOT_FOUND);
        }
    }
    @GetMapping("/{id}/location")
    public ResponseEntity<Location> getCurrentLocation(@PathVariable String id){
        return new ResponseEntity<>(truckService.getCurrentLocationByTruckId(id), HttpStatus.OK);
    }
    @PutMapping("/{id}/location")
    public ResponseEntity<Truck> setCurrentLocation(@PathVariable String id, @RequestBody Location location){
        return new ResponseEntity<>(truckService.setCurrentLocationByTruckId(id, location), HttpStatus.OK);
    }
    @PutMapping("/{truckId}/user/{userId}")
    public ResponseEntity<Truck> setDriver(@PathVariable String truckId, @PathVariable String userId){
        return new ResponseEntity<>(truckService.setDriver(truckId, userId), HttpStatus.OK);
    }
    @PutMapping("/{truckId}/deliver")
    public ResponseEntity<Truck> deliverGoods(@PathVariable String truckId){
        return new ResponseEntity<>(truckService.deliverGoods(truckId), HttpStatus.OK);
    }
}
