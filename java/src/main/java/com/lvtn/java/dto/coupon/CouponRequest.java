package com.lvtn.java.dto.coupon;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CouponRequest {
    private String code;
    private Double discountPercentage;
    private Double maxDiscountAmount;
    private Integer quantity;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private String status="active";
    private Integer createdBy;
    private Integer updatedBy;
    private Integer deletedBy;
    private LocalDateTime deletedAt;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}