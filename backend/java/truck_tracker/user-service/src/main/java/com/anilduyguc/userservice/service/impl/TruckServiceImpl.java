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
                    .content(truckSaveRequest.getContent())
                    .fromCity(truckSaveRequest.getFromCity())
                    .user(user)
                    .destinationCity(truckSaveRequest.getDestinationCity())
                    .status(truckSaveRequest.getStatus())
                    .isArrived(false)
                    .isEscorted(false)
                    .latitude(truckSaveRequest.getLatitude())
                    .longitude(truckSaveRequest.getLongitude())
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
        System.out.println("Destinatiyon City: " + destinationCity.getName());
        String trucksContent = truck.getContent();
        City city = cityRepository.findById(destinationCity.getId()).orElseThrow(() -> {
            throw new RuntimeException("No city found with id " + destinationCity.getId());
        });
        String cityRequirementList = city.getRequirementList();
        List<String> numbersOfCities = extractInt2(cityRequirementList);
        List<String> numbersOfTrucks = extractInt2(trucksContent);
        String str = "";
        String str2 = "";
        String str3 = "";
        for (int i = 0; i < 4; i++) {
            if (i == 0) {
                str += numbersOfCities.get(i) + " L su, ";
                str2 += "0 " + " L su, ";
                int a = Integer.parseInt(numbersOfCities.get(i)) - Integer.parseInt(numbersOfTrucks.get(i));
                str3 += a + " L su, ";
            } else if (i == 1) {
                str += numbersOfCities.get(i) + " kg yiyecek, ";
                str2 += "0 " + " kg yiyecek, ";
                int a = Integer.parseInt(numbersOfCities.get(i)) - Integer.parseInt(numbersOfTrucks.get(i));
                str3 += a + " kg yiyecek, ";
            } else if (i == 2) {
                str += numbersOfCities.get(i) + " çadır, ";
                str2 += "0 " + " çadır, ";
                int a = Integer.parseInt(numbersOfCities.get(i)) - Integer.parseInt(numbersOfTrucks.get(i));
                str3 += a + " çadır, ";
            } else if (i == 3) {
                str += numbersOfCities.get(i) + " kişilik kıyafet";
                str2 += "0 " + " kişilik kıyafet";
                int a = Integer.parseInt(numbersOfCities.get(i)) - Integer.parseInt(numbersOfTrucks.get(i));
                str3 += a + " kişilik kıyafet ";
            }
        }
        System.out.println("STR: " + str);
        System.out.println("STR2: " + str2);
        System.out.println("STR3: " + str3);
        city.setRequirementList(str3);
        truck.setContent(str2);
        truck.setArrived(true);
        cityRepository.save(city);
        return truckRepository.save(truck);
    }
}
