package com.lvtn.java.modules.tripDetails.entity;

import com.lvtn.java.domain.AuditableEntity;
import com.lvtn.java.modules.tour.entity.Tour;
import com.lvtn.java.modules.user.entity.Account;
import jakarta.persistence.*;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Data
@Table(name = "departures")
public class Departure extends AuditableEntity {
    @ManyToOne
    @JoinColumn(name = "tour_id")
    private Tour tourId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "vehicle_id")
    private Vehicle vehicle;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "guide_id")
    private Account guide;

    @Column(name = "start_date")
    private LocalDateTime startTime;

    @Column(name = "end_date")
    private LocalDateTime endDate;

    @Column(name = "price_adult")
    private BigDecimal priceAdult;

    @Column(name = "price_children")
    private BigDecimal priceChildren;

    @Column(name = "price_baby")
    private BigDecimal priceBaby;

    @Column(name = "stock_adult")
    private int stockAdult;

    @Column(name = "stock_children")
    private int stockChildren;

    @Column(name = "stock_baby")
    private int stockBaby;

    @Column(name = "status")
    private String status = "active";

    @Column(name = "discount_percentage")
    private Integer discount;

    @Column(name = "departure_from")
    private String departureFrom;

}
