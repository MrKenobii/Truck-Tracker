package com.anilduyguc.userservice.service.impl;

import com.anilduyguc.userservice.dto.Location;
import com.anilduyguc.userservice.dto.truck.TruckSaveRequest;
import com.anilduyguc.userservice.modal.City;
import com.anilduyguc.userservice.modal.Truck;
import com.anilduyguc.userservice.modal.User;
import com.anilduyguc.userservice.repository.CityRepository;
import com.anilduyguc.userservice.repository.TruckRepository;
import com.anilduyguc.userservice.repository.UserRepository;
import com.anilduyguc.userservice.service.TruckService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
@RequiredArgsConstructor
public class TruckServiceImpl implements TruckService {
    private final TruckRepository truckRepository;
    private final UserRepository userRepository;
    private final CityRepository cityRepository;

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
    public Truck createTruck(TruckSaveRequest truckSaveRequest) {
        String id = UUID.randomUUID().toString();
        User user = userRepository.findById(truckSaveRequest.getUserId()).orElseThrow(() -> {
            throw new RuntimeException(" Not found");
        });
        System.out.println(user.getEmail());
        if(user.getRole().getName().equals("TRUCK_DRIVER")){
            Truck truck = Truck.builder()
                    .fromCity(truckSaveRequest.getFromCity())
                    .user(user)
                    .destinationCity(truckSaveRequest.getDestinationCity())
                    .status(truckSaveRequest.getStatus())
                    .isArrived(false)
                    .isEscorted(false)
                    .latitude(truckSaveRequest.getLatitude())
                    .longitude(truckSaveRequest.getLongitude())
                    .food(truckSaveRequest.getFood())
                    .tent(truckSaveRequest.getTent())
                    .clothing(truckSaveRequest.getClothing())
                    .water(truckSaveRequest.getWater())
                    .licensePlate(truckSaveRequest.getLicensePlate())
                    .build();
            truck.setId(id);
            System.out.println("TRUCK DRIVERRRRR");
            truckRepository.save(truck);
            return truck;
        }
        else return new Truck();
    }

    @Override
    public Truck updateTruck(String id, Truck truck) {
        Truck truckToUpdate = truckRepository.findById(id).orElseThrow(() -> {
            throw new RuntimeException("Truck with id: " + id + " was not found");
        });
        truckToUpdate.setArrived(truck.isArrived());
        truckToUpdate.setEscorted(truck.isEscorted());
        truckToUpdate.setStatus(truck.getStatus());
        truckToUpdate.setLatitude(truck.getLatitude());
        truckToUpdate.setLongitude(truck.getLongitude());

        truckToUpdate.setFromCity(truck.getFromCity());
        truckToUpdate.setDestinationCity(truck.getDestinationCity());
        truckToUpdate.setLicensePlate(truck.getLicensePlate());
        truckToUpdate.setFood(truck.getFood());
        truckToUpdate.setWater(truck.getWater());
        truckToUpdate.setTent(truck.getTent());
        truckToUpdate.setClothing(truck.getClothing());
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

    @Override
    public Truck setDriver(String truckId, String userId) {
        Truck truck = truckRepository.findById(truckId).orElseThrow(() -> {
            throw new RuntimeException("Not found");
        });
        if(truck != null){
            System.out.println(truck.getId());
            User user = userRepository.findById(userId).orElseThrow(() -> {
                throw new RuntimeException(" Not found");
            });
            System.out.println(user.getEmail());
            if(user.getRole().getName().equals("TRUCK_DRIVER")){
                System.out.println("TRUCK DRIVERRRRR");
                truck.setUser(user);
                truckRepository.save(truck);
                return truck;
            }
            else return new Truck();
        } else return new Truck();
    }
    public List<String> extractInt2(String str){

        Pattern pattern = Pattern.compile("\\d+");
        Matcher matcher = pattern.matcher(str);
        List<String> digits = new ArrayList<String>();

        while (matcher.find()) {
            digits.add(matcher.group());
        }
        return digits;

    }
    @Override
    public Truck deliverGoods(String truckId) {
        Truck truck = truckRepository.findById(truckId).orElseThrow(() -> {
            throw new RuntimeException("No truck found with id " + truckId);
        });

        City destinationCity = truck.getDestinationCity();
        City city = cityRepository.findById(destinationCity.getId()).orElseThrow(() -> {
            throw new RuntimeException("No city found with id " + destinationCity.getId());
        });
        city.setFood(city.getFood() - truck.getFood());
        city.setWater(city.getWater() - truck.getWater());
        city.setTent(city.getTent() - truck.getTent());
        city.setClothing(city.getClothing() - truck.getClothing());
        cityRepository.save(city);
        truck.setClothing(0);
        truck.setWater(0);
        truck.setFood(0);
        truck.setTent(0);
        return truckRepository.save(truck);
    }
}
