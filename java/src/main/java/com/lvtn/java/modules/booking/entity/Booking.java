package com.lvtn.java.modules.booking.entity;

import com.lvtn.java.domain.BaseEntity;
import com.lvtn.java.modules.tripDetails.entity.Departure;
import com.lvtn.java.modules.user.entity.User;
import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Entity
@Table(name = "bookings")
public class Booking extends BaseEntity {

    @Column(name = "booking_code", nullable = false, unique = true)
    private String bookingCode;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @Column(name = "full_name")
    private String fullName;

    private String phone;
    private String email;
    private String address;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "departure_id", nullable = false)
    private Departure departure;

    @Column(name = "coupon_id")
    private Integer couponId;

    @Column(name = "quantity_adult")
    private Integer quantityAdult = 0;
    @Column(name = "quantity_children")
    private Integer quantityChildren = 0;
    @Column(name = "quantity_baby")
    private Integer quantityBaby = 0;

    @Column(name = "adult_price")
    private BigDecimal adultPrice;

    @Column(name = "children_price")
    private BigDecimal childrenPrice;

    @Column(name = "baby_price")
    private BigDecimal babyPrice;

    @Column(name = "sub_total")
    private BigDecimal subTotal;

    private BigDecimal total;
    private BigDecimal discount = BigDecimal.ZERO;

    @Column(columnDefinition = "TEXT")
    private String note;

    private String status = "pending";

    @Column(columnDefinition = "boolean default false")
    private Boolean deleted = false;

    @Column(name = "deleted_at")
    private LocalDateTime deletedAt;

    @Column(name = "deleted_by")
    private Integer deletedBy;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @OneToMany(mappedBy = "booking", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<Passenger> passengers;

    @OneToMany(mappedBy = "booking", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<Payment> payments;

    @Column(name = "updated_by")
    private Integer updatedBy;
}