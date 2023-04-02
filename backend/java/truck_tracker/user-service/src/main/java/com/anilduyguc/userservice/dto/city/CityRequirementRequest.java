package com.anilduyguc.userservice.dto.city;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class CityRequirementRequest {
    private Integer tent;
    private Integer food;
    private Integer water;
    private Integer clothing;
}
