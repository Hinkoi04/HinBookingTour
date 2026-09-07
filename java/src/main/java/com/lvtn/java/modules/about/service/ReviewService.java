package com.lvtn.java.modules.about.service;


import com.lvtn.java.dto.review.ReviewRequest;
import com.lvtn.java.dto.review.ReviewResponse;

import java.util.List;

public interface ReviewService {
    List<ReviewResponse> findAll();
    List<ReviewResponse> findApprovedByTour(Integer tourId);
    ReviewResponse create(ReviewRequest request, Integer userId);
    ReviewResponse toggleVisibility(Integer id, Integer adminId);
    void delete(Integer id, Integer userId);
    List<ReviewResponse> getTrash();
    ReviewResponse restore(Integer id, Integer adminId);
    void hardDelete(Integer id);
}