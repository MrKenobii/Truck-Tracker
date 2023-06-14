package com.anilduyguc.userservice;


import com.anilduyguc.userservice.controller.TruckController;
import com.anilduyguc.userservice.modal.Truck;
import com.anilduyguc.userservice.service.TruckService;
import org.junit.jupiter.api.MethodOrderer;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestMethodOrder;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.springframework.boot.test.context.SpringBootTest;
import org.junit.jupiter.api.Order;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StopWatch;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import static org.mockito.Mockito.when;
import static org.junit.jupiter.api.Assertions.assertEquals;

@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
@SpringBootTest(classes = {TruckTest.class})
public class TruckTest {
    @Mock
    TruckService truckService;

    @InjectMocks
    TruckController truckController;

    List<Truck> truckList;


    @Test
    @Order(1)
    public void testGetAllTrucks5(){
        truckList = new ArrayList<>();
        for(int i=0;i<5;i++){
            truckList.add(Truck.builder()
                    .user(null)
                    .id(UUID.randomUUID().toString())
                    .clothing(123)
                    .food(123)
                    .tent(123)
                    .water(123)
                    .fromCity(null)
                    .latitude("123123")
                    .longitude("23213123")
                    .status("Devam")
                    .destinationCity(null)
                    .isArrived(false)
                    .licensePlate("123123123")
                    .isTookOff(true)
                    .isEscorted(true)
                    .build());
        }
        StopWatch stopWatch = new StopWatch();
        stopWatch.start();
        long startTime = System.currentTimeMillis();
        when(truckService.getAllTrucks()).thenReturn(truckList);
        ResponseEntity<List<Truck>> trucks = truckController.getTrucks();
        stopWatch.stop();
        long endTime = System.currentTimeMillis();
        System.out.println("Time diff: " + (endTime - startTime) + " Size: " + trucks.getBody().size());
        System.out.println("Time diff: " + (stopWatch.getTotalTimeMillis()) + " Size: " + trucks.getBody().size());
        assertEquals(HttpStatus.OK,trucks.getStatusCode());
        assertEquals(truckList.size(), trucks.getBody().size());

        for(int i =0; i<trucks.getBody().size(); i++){
            assertEquals(truckList.get(i).getId(), trucks.getBody().get(i).getId());
            assertEquals(truckList.get(i).getFood(), trucks.getBody().get(i).getFood());
            assertEquals(truckList.get(i).getLicensePlate(), trucks.getBody().get(i).getLicensePlate());
        }
    }


    @Test
    @Order(2)
    public void testGetAllTrucks100(){
        truckList = new ArrayList<>();
        for(int i=0;i<100;i++){
            truckList.add(Truck.builder()
                    .user(null)
                    .id(UUID.randomUUID().toString())
                    .clothing(123)
                    .food(123)
                    .tent(123)
                    .water(123)
                    .fromCity(null)
                    .latitude("123123")
                    .longitude("23213123")
                    .status("Devam")
                    .destinationCity(null)
                    .isArrived(false)
                    .licensePlate("123123123")
                    .isTookOff(true)
                    .isEscorted(true)
                    .build());
        }

        long startTime = System.currentTimeMillis();
        when(truckService.getAllTrucks()).thenReturn(truckList);
        ResponseEntity<List<Truck>> trucks = truckController.getTrucks();
        long endTime = System.currentTimeMillis();
        System.out.println("Time diff: " + (endTime - startTime) + " Size: " + trucks.getBody().size());
        assertEquals(HttpStatus.OK,trucks.getStatusCode());
        assertEquals(truckList.size(), trucks.getBody().size());

        for(int i =0; i<trucks.getBody().size(); i++){
            assertEquals(truckList.get(i).getId(), trucks.getBody().get(i).getId());
            assertEquals(truckList.get(i).getFood(), trucks.getBody().get(i).getFood());
            assertEquals(truckList.get(i).getLicensePlate(), trucks.getBody().get(i).getLicensePlate());
        }
    }

    @Test
    @Order(3)
    public void testGetAllTrucks500(){
        truckList = new ArrayList<>();
        for(int i=0;i<500;i++){
            truckList.add(Truck.builder()
                    .user(null)
                    .id(UUID.randomUUID().toString())
                    .clothing(123)
                    .food(123)
                    .tent(123)
                    .water(123)
                    .fromCity(null)
                    .latitude("123123")
                    .longitude("23213123")
                    .status("Devam")
                    .destinationCity(null)
                    .isArrived(false)
                    .licensePlate("123123123")
                    .isTookOff(true)
                    .isEscorted(true)
                    .build());
        }

        long startTime = System.currentTimeMillis();
        when(truckService.getAllTrucks()).thenReturn(truckList);
        ResponseEntity<List<Truck>> trucks = truckController.getTrucks();
        long endTime = System.currentTimeMillis();
        System.out.println("Time diff: " + (endTime - startTime) + " Size: " + trucks.getBody().size());
        assertEquals(HttpStatus.OK,trucks.getStatusCode());
        assertEquals(truckList.size(), trucks.getBody().size());

        for(int i =0; i<trucks.getBody().size(); i++){
            assertEquals(truckList.get(i).getId(), trucks.getBody().get(i).getId());
            assertEquals(truckList.get(i).getFood(), trucks.getBody().get(i).getFood());
            assertEquals(truckList.get(i).getLicensePlate(), trucks.getBody().get(i).getLicensePlate());
        }
    }

    @Test
    @Order(4)
    public void testGetAllTrucks1000(){
        truckList = new ArrayList<>();
        for(int i=0;i<1000;i++){
            truckList.add(Truck.builder()
                    .user(null)
                    .id(UUID.randomUUID().toString())
                    .clothing(123)
                    .food(123)
                    .tent(123)
                    .water(123)
                    .fromCity(null)
                    .latitude("123123")
                    .longitude("23213123")
                    .status("Devam")
                    .destinationCity(null)
                    .isArrived(false)
                    .licensePlate("123123123")
                    .isTookOff(true)
                    .isEscorted(true)
                    .build());
        }

        long startTime = System.currentTimeMillis();
        when(truckService.getAllTrucks()).thenReturn(truckList);
        ResponseEntity<List<Truck>> trucks = truckController.getTrucks();
        long endTime = System.currentTimeMillis();
        System.out.println("Time diff: " + (endTime - startTime) + " Size: " + trucks.getBody().size());
        assertEquals(HttpStatus.OK,trucks.getStatusCode());
        assertEquals(truckList.size(), trucks.getBody().size());

        for(int i =0; i<trucks.getBody().size(); i++){
            assertEquals(truckList.get(i).getId(), trucks.getBody().get(i).getId());
            assertEquals(truckList.get(i).getFood(), trucks.getBody().get(i).getFood());
            assertEquals(truckList.get(i).getLicensePlate(), trucks.getBody().get(i).getLicensePlate());
        }
    }


    @Test
    @Order(5)
    public void testGetAllTrucks5000(){
        truckList = new ArrayList<>();
        for(int i=0;i<5000;i++){
            truckList.add(Truck.builder()
                    .user(null)
                    .id(UUID.randomUUID().toString())
                    .clothing(123)
                    .food(123)
                    .tent(123)
                    .water(123)
                    .fromCity(null)
                    .latitude("123123")
                    .longitude("23213123")
                    .status("Devam")
                    .destinationCity(null)
                    .isArrived(false)
                    .licensePlate("123123123")
                    .isTookOff(true)
                    .isEscorted(true)
                    .build());
        }

        long startTime = System.currentTimeMillis();
        when(truckService.getAllTrucks()).thenReturn(truckList);
        ResponseEntity<List<Truck>> trucks = truckController.getTrucks();
        long endTime = System.currentTimeMillis();
        System.out.println("Time diff: " + (endTime - startTime) + " Size: " + trucks.getBody().size());
        assertEquals(HttpStatus.OK,trucks.getStatusCode());
        assertEquals(truckList.size(), trucks.getBody().size());

        for(int i =0; i<trucks.getBody().size(); i++){
            assertEquals(truckList.get(i).getId(), trucks.getBody().get(i).getId());
            assertEquals(truckList.get(i).getFood(), trucks.getBody().get(i).getFood());
            assertEquals(truckList.get(i).getLicensePlate(), trucks.getBody().get(i).getLicensePlate());
        }
    }

    @Test
    @Order(6)
    public void testGetAllTrucks10000(){
        truckList = new ArrayList<>();
        for(int i=0;i<10000;i++){
            truckList.add(Truck.builder()
                    .user(null)
                    .id(UUID.randomUUID().toString())
                    .clothing(123)
                    .food(123)
                    .tent(123)
                    .water(123)
                    .fromCity(null)
                    .latitude("123123")
                    .longitude("23213123")
                    .status("Devam")
                    .destinationCity(null)
                    .isArrived(false)
                    .licensePlate("123123123")
                    .isTookOff(true)
                    .isEscorted(true)
                    .build());
        }

        long startTime = System.currentTimeMillis();
        when(truckService.getAllTrucks()).thenReturn(truckList);
        ResponseEntity<List<Truck>> trucks = truckController.getTrucks();
        long endTime = System.currentTimeMillis();
        System.out.println("Time diff: " + (endTime - startTime) + " Size: " + trucks.getBody().size());
        assertEquals(HttpStatus.OK,trucks.getStatusCode());
        assertEquals(truckList.size(), trucks.getBody().size());

        for(int i =0; i<trucks.getBody().size(); i++){
            assertEquals(truckList.get(i).getId(), trucks.getBody().get(i).getId());
            assertEquals(truckList.get(i).getFood(), trucks.getBody().get(i).getFood());
            assertEquals(truckList.get(i).getLicensePlate(), trucks.getBody().get(i).getLicensePlate());
        }
    }

    @Test
    @Order(7)
    public void testGetAllTrucks50000(){
        truckList = new ArrayList<>();
        for(int i=0;i<50000;i++){
            truckList.add(Truck.builder()
                    .user(null)
                    .id(UUID.randomUUID().toString())
                    .clothing(123)
                    .food(123)
                    .tent(123)
                    .water(123)
                    .fromCity(null)
                    .latitude("123123")
                    .longitude("23213123")
                    .status("Devam")
                    .destinationCity(null)
                    .isArrived(false)
                    .licensePlate("123123123")
                    .isTookOff(true)
                    .isEscorted(true)
                    .build());
        }

        long startTime = System.currentTimeMillis();
        when(truckService.getAllTrucks()).thenReturn(truckList);
        ResponseEntity<List<Truck>> trucks = truckController.getTrucks();
        long endTime = System.currentTimeMillis();
        System.out.println("Time diff: " + (endTime - startTime) + " Size: " + trucks.getBody().size());
        assertEquals(HttpStatus.OK,trucks.getStatusCode());
        assertEquals(truckList.size(), trucks.getBody().size());

        for(int i =0; i<trucks.getBody().size(); i++){
            assertEquals(truckList.get(i).getId(), trucks.getBody().get(i).getId());
            assertEquals(truckList.get(i).getFood(), trucks.getBody().get(i).getFood());
            assertEquals(truckList.get(i).getLicensePlate(), trucks.getBody().get(i).getLicensePlate());
        }
    }

    @Test
    @Order(8)
    public void testGetAllTrucks100000(){
        truckList = new ArrayList<>();
        for(int i=0;i<100000;i++){
            truckList.add(Truck.builder()
                    .user(null)
                    .id(UUID.randomUUID().toString())
                    .clothing(123)
                    .food(123)
                    .tent(123)
                    .water(123)
                    .fromCity(null)
                    .latitude("123123")
                    .longitude("23213123")
                    .status("Devam")
                    .destinationCity(null)
                    .isArrived(false)
                    .licensePlate("123123123")
                    .isTookOff(true)
                    .isEscorted(true)
                    .build());
        }

        long startTime = System.currentTimeMillis();
        when(truckService.getAllTrucks()).thenReturn(truckList);
        ResponseEntity<List<Truck>> trucks = truckController.getTrucks();
        long endTime = System.currentTimeMillis();
        System.out.println("Time diff: " + (endTime - startTime) + " Size: " + trucks.getBody().size());
        assertEquals(HttpStatus.OK,trucks.getStatusCode());
        assertEquals(truckList.size(), trucks.getBody().size());

        for(int i =0; i<trucks.getBody().size(); i++){
            assertEquals(truckList.get(i).getId(), trucks.getBody().get(i).getId());
            assertEquals(truckList.get(i).getFood(), trucks.getBody().get(i).getFood());
            assertEquals(truckList.get(i).getLicensePlate(), trucks.getBody().get(i).getLicensePlate());
        }
    }

    @Test
    @Order(9)
    public void testGetAllTrucks500000(){
        truckList = new ArrayList<>();
        for(int i=0;i<500000;i++){
            truckList.add(Truck.builder()
                    .user(null)
                    .id(UUID.randomUUID().toString())
                    .clothing(123)
                    .food(123)
                    .tent(123)
                    .water(123)
                    .fromCity(null)
                    .latitude("123123")
                    .longitude("23213123")
                    .status("Devam")
                    .destinationCity(null)
                    .isArrived(false)
                    .licensePlate("123123123")
                    .isTookOff(true)
                    .isEscorted(true)
                    .build());
        }

        long startTime = System.currentTimeMillis();
        when(truckService.getAllTrucks()).thenReturn(truckList);
        ResponseEntity<List<Truck>> trucks = truckController.getTrucks();
        long endTime = System.currentTimeMillis();
        System.out.println("Time diff: " + (endTime - startTime) + " Size: " + trucks.getBody().size());
        assertEquals(HttpStatus.OK,trucks.getStatusCode());
        assertEquals(truckList.size(), trucks.getBody().size());

        for(int i =0; i<trucks.getBody().size(); i++){
            assertEquals(truckList.get(i).getId(), trucks.getBody().get(i).getId());
            assertEquals(truckList.get(i).getFood(), trucks.getBody().get(i).getFood());
            assertEquals(truckList.get(i).getLicensePlate(), trucks.getBody().get(i).getLicensePlate());
        }
    }

    @Test
    @Order(8)
    public void testGetAllTrucks1000000(){
        truckList = new ArrayList<>();
        for(int i=0;i<1000000;i++){
            truckList.add(Truck.builder()
                    .user(null)
                    .id(UUID.randomUUID().toString())
                    .clothing(123)
                    .food(123)
                    .tent(123)
                    .water(123)
                    .fromCity(null)
                    .latitude("123123")
                    .longitude("23213123")
                    .status("Devam")
                    .destinationCity(null)
                    .isArrived(false)
                    .licensePlate("123123123")
                    .isTookOff(true)
                    .isEscorted(true)
                    .build());
        }

        long startTime = System.currentTimeMillis();
        when(truckService.getAllTrucks()).thenReturn(truckList);
        ResponseEntity<List<Truck>> trucks = truckController.getTrucks();
        long endTime = System.currentTimeMillis();
        System.out.println("Time diff: " + (endTime - startTime) + " Size: " + trucks.getBody().size());
        assertEquals(HttpStatus.OK,trucks.getStatusCode());
        assertEquals(truckList.size(), trucks.getBody().size());

        for(int i =0; i<trucks.getBody().size(); i++){
            assertEquals(truckList.get(i).getId(), trucks.getBody().get(i).getId());
            assertEquals(truckList.get(i).getFood(), trucks.getBody().get(i).getFood());
            assertEquals(truckList.get(i).getLicensePlate(), trucks.getBody().get(i).getLicensePlate());
        }
    }

    @Test
    @Order(8)
    public void testGetAllTrucks5000000(){
        truckList = new ArrayList<>();
        for(int i=0;i<5000000;i++){
            truckList.add(Truck.builder()
                    .user(null)
                    .id(UUID.randomUUID().toString())
                    .clothing(123)
                    .food(123)
                    .tent(123)
                    .water(123)
                    .fromCity(null)
                    .latitude("123123")
                    .longitude("23213123")
                    .status("Devam")
                    .destinationCity(null)
                    .isArrived(false)
                    .licensePlate("123123123")
                    .isTookOff(true)
                    .isEscorted(true)
                    .build());
        }

        long startTime = System.currentTimeMillis();
        when(truckService.getAllTrucks()).thenReturn(truckList);
        ResponseEntity<List<Truck>> trucks = truckController.getTrucks();
        long endTime = System.currentTimeMillis();
        System.out.println("Time diff: " + (endTime - startTime) + " Size: " + trucks.getBody().size());
        assertEquals(HttpStatus.OK,trucks.getStatusCode());
        assertEquals(truckList.size(), trucks.getBody().size());

        for(int i =0; i<trucks.getBody().size(); i++){
            assertEquals(truckList.get(i).getId(), trucks.getBody().get(i).getId());
            assertEquals(truckList.get(i).getFood(), trucks.getBody().get(i).getFood());
            assertEquals(truckList.get(i).getLicensePlate(), trucks.getBody().get(i).getLicensePlate());
        }
    }


}
