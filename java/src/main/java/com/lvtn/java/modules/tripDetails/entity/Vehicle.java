package com.lvtn.java.modules.tripDetails.entity;

import com.lvtn.java.domain.AuditableEntity;
import com.lvtn.java.domain.enums.VehicleType;
import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@Table(name = "vehicles")
public class Vehicle extends AuditableEntity {
    @Column
    private String name;
    @Enumerated(EnumType.STRING)
    @Column(name = "vehicle_type", nullable = false)
    private VehicleType vehicleType;
}
