package com.lvtn.java.modules.tripDetails.entity;

import com.lvtn.java.domain.AuditableEntity;
import com.lvtn.java.modules.tour.entity.Tour;
import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "schedules")
@Data
public class Schedule extends AuditableEntity {
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "tour_id")
    private Tour tour;

    @Column(name = "day_number")
    private int dayNumber;

    @Column
    private String title;

    @Column(columnDefinition = "TEXT")
    private String content;
}
