package com.lvtn.java.modules.coupon.entity;

import com.lvtn.java.domain.AuditableEntity;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "coupons")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Coupon extends AuditableEntity {

    @Column(unique = true, nullable = false)
    private String code;

    @Column(name = "discount_percentage")
    private Double discountPercentage;

    @Column(name = "max_discount_amount")
    private Double maxDiscountAmount;
    private Integer quantity;

    @Column(name = "used_count")
    private Integer usedCount;

    @Column(name = "start_date")
    private LocalDateTime startDate;

    @Column(name = "end_date")
    private LocalDateTime endDate;

    private String status;

}