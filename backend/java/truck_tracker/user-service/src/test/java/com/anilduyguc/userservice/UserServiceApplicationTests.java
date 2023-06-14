package com.anilduyguc.userservice;

import com.anilduyguc.userservice.controller.TruckController;
import com.anilduyguc.userservice.modal.Truck;
import com.anilduyguc.userservice.service.TruckService;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.*;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.http.MediaType;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.result.MockMvcResultHandlers;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.util.List;

import static org.mockito.Mockito.when;


@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
@ComponentScan(basePackages = "com.anilduyguc.userservice")
@AutoConfigureMockMvc
@ContextConfiguration
@SpringBootTest(classes = {UserServiceApplicationTests.class})
class UserServiceApplicationTests {
    @Autowired
    MockMvc mockMvc;

    @Mock
    TruckService truckService;
    List<Truck> truckList;
    @InjectMocks
    TruckController truckController;

    @BeforeEach
    public void setUp(){
        mockMvc = MockMvcBuilders.standaloneSetup(truckController).build();
    }

    @Test
    @Order(1)
    public void testGetAllCountries(){
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
                            .status("DEvam")
                            .destinationCity(null)
                            .isArrived(false)
                            .licensePlate("123123123")
                            .isTookOff(true)
                            .isEscorted(true)
                    .build());
        }

        when(truckService.getAllTrucks()).thenReturn(truckList);

        try {
            MockMvcResultHandlers.print();
            this.mockMvc.perform(MockMvcRequestBuilders.get("/truck"))
                    .andExpect(MockMvcResultMatchers.status().isOk())
                    .andDo(MockMvcResultHandlers.print());
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

//    @Test
//    void contextLoads() {
////        com.sun.management.OperatingSystemMXBean operatingSystemMXBean =
////                (com.sun.management.OperatingSystemMXBean) ManagementFactory.getOperatingSystemMXBean();
//    }
//    @Test
//    void lambdaExpressions() {
//        int[] numbers = {0, 1, 2, 3, 4};
//        assertAll("numbers",
//                () -> assertEquals(numbers[0], 0),
//                () -> assertEquals(numbers[3], 3),
//                () -> assertEquals(numbers[4], 4)
//        );
//    }
}
