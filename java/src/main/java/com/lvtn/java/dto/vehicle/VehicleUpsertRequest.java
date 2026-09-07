package com.lvtn.java.dto.vehicle;

import com.lvtn.java.domain.enums.VehicleType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class VehicleUpsertRequest {
    private String name;
    private VehicleType vehicleType;
    private Integer createdBy;
    private Integer updatedBy;
    private Integer deletedBy;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;}
