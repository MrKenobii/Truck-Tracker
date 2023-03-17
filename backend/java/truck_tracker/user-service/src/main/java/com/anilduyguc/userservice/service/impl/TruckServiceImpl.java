package com.anilduyguc.userservice.service.impl;

import com.anilduyguc.userservice.dto.Location;
import com.anilduyguc.userservice.modal.City;
import com.anilduyguc.userservice.modal.Truck;
import com.anilduyguc.userservice.repository.TruckRepository;
import com.anilduyguc.userservice.service.TruckService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class TruckServiceImpl implements TruckService {
    private final TruckRepository truckRepository;

    @Override
    public List<Truck> getAllTrucks() {
        return truckRepository.findAll();
    }

    @Override
    public Truck getTruckById(String id) {
        return truckRepository.findById(id).orElseThrow(() -> {
            throw new RuntimeException("Truck with id: " + id + " was not found");
        });
    }

    @Override
    public Location getCurrentLocationByTruckId(String id) {
        Truck truck = truckRepository.findById(id).orElseThrow(() -> {
            throw new RuntimeException("Truck with id: " + id + " was not found");
        });
        Location location = new Location();
        location.setLatitude(truck.getLatitude());
        location.setLongitude(truck.getLongitude());
        return location;
    }



    @Override
    public City getFromCityByTruckId(String id) {
        Truck truck = truckRepository.findById(id).orElseThrow(() -> {
            throw new RuntimeException("Truck with id: " + id + " was not found");
        });
        return truck.getFromCity();
    }

    @Override
    public City getDestinationCityByTruckId(String id) {
        Truck truck = truckRepository.findById(id).orElseThrow(() -> {
            throw new RuntimeException("Truck with id: " + id + " was not found");
        });
        return truck.getDestinationCity();
    }

    @Override
    public Truck createTruck(Truck truck) {
        String id = UUID.randomUUID().toString();
        truck.setId(id);
        return truckRepository.save(truck);
    }

    @Override
    public Truck updateTruck(String id, Truck truck) {
        Truck truckToUpdate = truckRepository.findById(id).orElseThrow(() -> {
            throw new RuntimeException("Truck with id: " + id + " was not found");
        });
        truckToUpdate.setArrived(truck.isArrived());
        truckToUpdate.setContent(truck.getContent());
        truckToUpdate.setEscorted(truck.isEscorted());
        truckToUpdate.setStatus(truck.getStatus());
        truckToUpdate.setLatitude(truck.getLatitude());
        truckToUpdate.setLongitude(truck.getLongitude());
        truckToUpdate.setFromLongitude(truck.getFromLongitude());
        truckToUpdate.setFromLatitude(truck.getFromLatitude());
        truckToUpdate.setToLatitude(truck.getToLatitude());
        truckToUpdate.setToLongitude(truck.getToLongitude());
        truckToUpdate.setFromCity(truck.getFromCity());
        truckToUpdate.setDestinationCity(truck.getDestinationCity());
        truckToUpdate.setLicensePlate(truck.getLicensePlate());
        truckRepository.save(truckToUpdate);
        return truckToUpdate;

    }

    @Override
    public void deleteTruck(String id) {
        Truck truck = truckRepository.findById(id).orElseThrow(() -> {
            throw new RuntimeException("Truck with id: " + id + " was not found");
        });
        truckRepository.delete(truck);
    }

    @Override
    public Truck setCurrentLocationByTruckId(String id, Location location) {
        Truck truck = truckRepository.findById(id).orElseThrow(() -> {
            throw new RuntimeException("Truck with id: " + id + " was not found");
        });
        truck.setLongitude(location.getLongitude());
        truck.setLatitude(location.getLatitude());
        truckRepository.save(truck);
        return truck;
    }
}
