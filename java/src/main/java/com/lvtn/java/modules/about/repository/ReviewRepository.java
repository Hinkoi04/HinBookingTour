package com.lvtn.java.modules.about.repository;

import com.lvtn.java.modules.about.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ReviewRepository extends JpaRepository<Review, Integer> {
    List<Review> findByDeletedFalse();
    List<Review> findByTourIdAndDeletedFalseAndIsApprovedTrue(Integer tourId);
    List<Review> findByDeletedTrue();
}