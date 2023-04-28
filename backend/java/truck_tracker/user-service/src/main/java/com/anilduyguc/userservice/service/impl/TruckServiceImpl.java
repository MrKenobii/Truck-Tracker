package com.anilduyguc.userservice.service.impl;

import com.anilduyguc.userservice.dto.Location;
import com.anilduyguc.userservice.dto.truck.TruckActionResponse;
import com.anilduyguc.userservice.dto.truck.TruckEscortResponse;
import com.anilduyguc.userservice.dto.truck.TruckSaveRequest;
import com.anilduyguc.userservice.modal.City;
import com.anilduyguc.userservice.modal.Truck;
import com.anilduyguc.userservice.modal.User;
import com.anilduyguc.userservice.repository.CityRepository;
import com.anilduyguc.userservice.repository.TruckRepository;
import com.anilduyguc.userservice.repository.UserRepository;
import com.anilduyguc.userservice.service.TruckService;
import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;


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
        return truckRepository.findById(id).orElseThrow(() -> new RuntimeException("Truck with id: " + id + " was not found"));
    }

    @Override
    public Location getCurrentLocationByTruckId(String id) {
        Truck truck = truckRepository.findById(id).orElseThrow(() -> new RuntimeException("Truck with id: " + id + " was not found"));
        Location location = new Location();
        location.setLatitude(truck.getLatitude());
        location.setLongitude(truck.getLongitude());
        return location;
    }



    @Override
    public City getFromCityByTruckId(String id) {
        Truck truck = truckRepository.findById(id).orElseThrow(() -> new RuntimeException("Truck with id: " + id + " was not found"));
        return truck.getFromCity();
    }

    @Override
    public City getDestinationCityByTruckId(String id) {
        Truck truck = truckRepository.findById(id).orElseThrow(() -> new RuntimeException("Truck with id: " + id + " was not found"));
        return truck.getDestinationCity();
    }

    @Override
    public Truck createTruck(TruckSaveRequest truckSaveRequest) {
        String id = UUID.randomUUID().toString();
        User user = userRepository.findById(truckSaveRequest.getUserId()).orElseThrow(() -> new RuntimeException(" Not found"));
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
                    .isTookOff(false)
                    .licensePlate(truckSaveRequest.getLicensePlate())
                    .build();
            truck.setId(id);
            truckRepository.save(truck);
            return truck;
        }
        else return new Truck();
    }

    @Override
    public Truck updateTruck(String id, Truck truck) {
        Truck truckToUpdate = truckRepository.findById(id).orElseThrow(() -> new RuntimeException("Truck with id: " + id + " was not found"));
        truckToUpdate.setArrived(truck.isArrived());
        truckToUpdate.setEscorted(truck.isEscorted());
        truckToUpdate.setStatus(truck.getStatus());
        truckToUpdate.setLatitude(truck.getLatitude());
        truckToUpdate.setLongitude(truck.getLongitude());
        truckToUpdate.setTookOff(truck.isTookOff());
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
        Truck truck = truckRepository.findById(id).orElseThrow(() -> new RuntimeException("Truck with id: " + id + " was not found"));
        truckRepository.delete(truck);
    }

    @Override
    public Truck setCurrentLocationByTruckId(String id, Location location) {
        Truck truck = truckRepository.findById(id).orElseThrow(() -> new RuntimeException("Truck with id: " + id + " was not found"));
        truck.setLongitude(location.getLongitude());
        truck.setLatitude(location.getLatitude());
        truckRepository.save(truck);
        return truck;
    }

    @Override
    public Truck setDriver(String truckId, String userId) {
        Truck truck = truckRepository.findById(truckId).orElseThrow(() -> new RuntimeException("Not found with id: " + truckId));
        if(truck != null){
            System.out.println(truck.getId());
            User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("Not found with id " + truckId));
            System.out.println(user.getEmail());
            if(user.getRole().getName().equals("TRUCK_DRIVER")){
                truck.setUser(user);
                truckRepository.save(truck);
                return truck;
            }
            else return new Truck();
        } else return new Truck();
    }
    @Override
    public TruckActionResponse deliverGoods(String truckId) {
        Truck truck = truckRepository.findById(truckId).orElseThrow(() -> new RuntimeException("No truck found with id " + truckId));
        if(truck.isTookOff()){
            City destinationCity = truck.getDestinationCity();
            City city = cityRepository.findById(destinationCity.getId()).orElseThrow(() -> new RuntimeException("No city found with id " + destinationCity.getId()));
            city.setFood(city.getFood() - truck.getFood());
            city.setWater(city.getWater() - truck.getWater());
            city.setTent(city.getTent() - truck.getTent());
            city.setClothing(city.getClothing() - truck.getClothing());
            cityRepository.save(city);
            truck.setClothing(0);
            truck.setWater(0);
            truck.setFood(0);
            truck.setTent(0);
            truck.setStatus("Teslim edildi");
            truck.setArrived(true);
            Truck savedTruck = truckRepository.save(truck);
            return TruckActionResponse.builder()
                    .truckId(truckId)
                    .licensePlate(savedTruck.getLicensePlate())
                    .message("Tır başarıyla mallarını teslim etti")
                    .status(savedTruck.getStatus())
                    .build();

        } else {
            return TruckActionResponse.builder()
                    .truckId(truckId)
                    .licensePlate(truck.getLicensePlate())
                    .message(truck.getLicensePlate() + " plakalı tır mallarını zaten teslim etmiştir.")
                    .status(truck.getStatus())
                    .build();
        }
    }

    @Override
    public TruckActionResponse takeOff(String truckId) {
        Truck truck = truckRepository.findById(truckId).orElseThrow(() -> new RuntimeException("No truck found with id " + truckId));
        if(!truck.isTookOff()){
            truck.setTookOff(true);
            truck.setStatus("Varış noktasına gidiliyor");
            Truck savedTruck = truckRepository.save(truck);
            return TruckActionResponse.builder()
                    .truckId(truckId)
                    .licensePlate(savedTruck.getLicensePlate())
                    .message("Yola çıkıldı.")
                    .status(savedTruck.getStatus())
                    .build();
        } else {
            return TruckActionResponse.builder()
                    .truckId(truckId)
                    .licensePlate(truck.getLicensePlate())
                    .message(truck.getLicensePlate() +  " plakalı tır zaten yola çıkmıştır.")
                    .status(truck.getStatus())
                    .build();
        }
    }

    @Override
    public TruckEscortResponse escortTruck(String truckId, String userId) {
        Truck truck = truckRepository.findById(truckId).orElseThrow(() -> new RuntimeException("No truck found with id " + truckId));
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("No user found with id: " + userId));
        if(!truck.isEscorted()){
            if(user.getRole().getName().equals("POLICE")){
                truck.setEscorted(true);
                truckRepository.save(truck);
                return TruckEscortResponse.builder().licensePlate(truck.getLicensePlate()).message(truck.getLicensePlate() + " plakalı tıra polis yardımı geliyor").status("BAŞARILI").build();
            } else return TruckEscortResponse.builder().licensePlate(truck.getLicensePlate()).message("Tıra eşlik etmek isteyen kullanıcı 'POLİS' rol tipinde").status("HATA").build();
        } else return TruckEscortResponse.builder().licensePlate(truck.getLicensePlate()).message("Tıra zaten eşlik ediliyor").status("HATA").build();
    }
}
