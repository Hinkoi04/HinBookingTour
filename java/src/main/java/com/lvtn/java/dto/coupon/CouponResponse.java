package com.lvtn.java.dto.coupon;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CouponResponse {
    private Integer id;
    private String code;
    private Double discountPercentage;
    private Double maxDiscountAmount;
    private Integer quantity;
    private Integer usedCount;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private String status;
    private Integer createdBy;
    private Integer updatedBy;
    private Integer deletedBy;
    private LocalDateTime deletedAt;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}