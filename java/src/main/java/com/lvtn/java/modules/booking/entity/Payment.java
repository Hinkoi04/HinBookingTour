package com.lvtn.java.modules.booking.entity;

import com.lvtn.java.domain.BaseEntity;
import jakarta.persistence.*;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "payments")
public class Payment extends BaseEntity {


    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "booking_id", nullable = false)
    private Booking booking;

    @Column(name = "transaction_id")
    private String transactionId;

    @Column(name = "payment_method",nullable = false)
    private String paymentMethod;

    @Column(name = "payment_type")
    private String paymentType = "full";

    private BigDecimal amount;

    @Column(name = "payment_status")
    private String paymentStatus = "pending";

    @Column(name = "paid_at")
    private LocalDateTime paidAt;
}