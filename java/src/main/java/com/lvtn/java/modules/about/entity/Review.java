package com.lvtn.java.modules.about.entity;

import com.lvtn.java.domain.BaseEntity;
import com.lvtn.java.modules.booking.entity.Booking;
import com.lvtn.java.modules.tour.entity.Tour;
import com.lvtn.java.modules.user.entity.User;
import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "reviews")
public class Review extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "tour_id")
    private Tour tour;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "booking_id")
    private Booking booking;

    private Integer rating;

    @Column(columnDefinition = "TEXT")
    private String content;

    @Column(name = "is_approved")
    private Boolean isApproved = false;

    @Column(name = "approved_by")
    private Integer approvedBy;

    private Boolean deleted = false;

    @Column(name = "deleted_by")
    private Integer deletedBy;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;
}