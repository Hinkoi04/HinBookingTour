package com.lvtn.java.dto.departure;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DepartureUpsertRequest {
    private Integer tourId;
    private Integer vehicleId;
    private Integer guideId;
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
    private String departureFrom;
    private LocalDateTime deletedAt;
    private Integer createdBy;
    private Integer updatedBy;
    private Integer deletedBy;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

}
