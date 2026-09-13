package com.lvtn.java.modules.about.repository;

import com.lvtn.java.modules.about.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ReviewRepository extends JpaRepository<Review, Integer> {
    @Query("SELECT r FROM Review r LEFT JOIN FETCH r.user LEFT JOIN FETCH r.tour LEFT JOIN FETCH r.booking WHERE r.deleted = false")
    List<Review> findByDeletedFalse();

    @Query("SELECT r FROM Review r LEFT JOIN FETCH r.user LEFT JOIN FETCH r.tour LEFT JOIN FETCH r.booking WHERE r.tour.id = :tourId AND r.deleted = false AND r.isApproved = true")
    List<Review> findByTourIdAndDeletedFalseAndIsApprovedTrue(@Param("tourId") Integer tourId);

    @Query("SELECT r FROM Review r LEFT JOIN FETCH r.user LEFT JOIN FETCH r.tour LEFT JOIN FETCH r.booking WHERE r.deleted = true")
    List<Review> findByDeletedTrue();
}