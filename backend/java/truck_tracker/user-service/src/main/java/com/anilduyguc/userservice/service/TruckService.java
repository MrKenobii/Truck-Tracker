package com.anilduyguc.userservice.service;

import com.anilduyguc.userservice.dto.Location;
import com.anilduyguc.userservice.dto.truck.TruckActionResponse;
import com.anilduyguc.userservice.dto.truck.TruckEscortResponse;
import com.anilduyguc.userservice.dto.truck.TruckSaveRequest;
import com.anilduyguc.userservice.modal.City;
import com.anilduyguc.userservice.modal.Truck;
import com.anilduyguc.userservice.modal.User;

import java.util.List;

public interface TruckService {
    List<Truck> getAllTrucks();
    Truck getTruckById(String id);
    Location getCurrentLocationByTruckId(String id);
    City getFromCityByTruckId(String id);
    City getDestinationCityByTruckId(String id);
    Truck createTruck(TruckSaveRequest truckSaveRequest);
    Truck updateTruck(String id, Truck truck);
    void deleteTruck(String id);
    Truck setCurrentLocationByTruckId(String id, Location location);
    Truck setDriver(String truckId, String userId);
    TruckActionResponse deliverGoods(String truckId);

    TruckActionResponse takeOff(String truckId);

    TruckEscortResponse escortTruck(String truckId, String userId);
}
