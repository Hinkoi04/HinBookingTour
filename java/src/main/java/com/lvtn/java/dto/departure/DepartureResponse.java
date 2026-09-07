package com.lvtn.java.dto.departure;

import com.lvtn.java.domain.enums.VehicleType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DepartureResponse {
    private Integer id;
    private Integer tourId;
    private String tourTitle;

    private Integer vehicleId;
    private String vehicleName;
    private VehicleType vehicleType;
    private Integer guideId;
    private String guideName;
    private String departureFrom;
    private LocalDateTime startTime;
    private LocalDateTime endDate;
    private BigDecimal priceAdult;
    private BigDecimal priceChildren;
    private BigDecimal priceBaby;
    private int stockAdult;
    private int stockChildren;
    private int stockBaby;
    private Integer discount;
    private String status = "active";
    private Boolean deleted = false;
    private LocalDateTime deletedAt;
    private Integer createdBy;
    private Integer updatedBy;
    private Integer deletedBy;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
