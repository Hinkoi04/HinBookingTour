package com.lvtn.java.modules.booking.entity;

import com.lvtn.java.domain.BaseEntity;
import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;

@Data
@Entity
@Table(name = "passengers")
public class Passenger extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "booking_id", nullable = false)
    private Booking booking;

    @Column(name = "full_name")
    private String fullName;

    private LocalDate dob;
    private String gender;

    @Column(name = "identity_card")
    private String identityCard;

    private String phone;

    @Column(name = "passenger_type", nullable = false)
    private String passengerType;
}