package com.anilduyguc.userservice.dto.truck;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
public class TruckActionResponse {
    private String message;
    private String status;
    private String truckId;
    private String licensePlate;
}
