package com.anilduyguc.userservice.dto.truck;

import com.anilduyguc.userservice.modal.City;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class TruckSaveRequest {
    private String licensePlate;
    private String content;
    private String longitude;
    private String latitude;
    private String status;
    private City fromCity;
    private City destinationCity;

    private String userId;
    private Integer tent;
    private Integer food;
    private Integer water;
    private Integer clothing;
}
