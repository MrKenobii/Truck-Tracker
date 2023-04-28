package com.anilduyguc.userservice.dto.truck;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class TruckEscortResponse {
    private String licensePlate;
    private String status;
    private String message;
}
