package com.lvtn.java.modules.about.service.impl;


import com.lvtn.java.dto.review.ReviewRequest;
import com.lvtn.java.dto.review.ReviewResponse;
import com.lvtn.java.modules.about.entity.Review;
import com.lvtn.java.modules.about.repository.ReviewRepository;
import com.lvtn.java.modules.about.service.ReviewService;
import com.lvtn.java.modules.booking.entity.Booking;
import com.lvtn.java.modules.booking.repository.BookingRepository;
import com.lvtn.java.modules.tour.entity.Tour;
import com.lvtn.java.modules.tour.repository.TourRepository;
import com.lvtn.java.modules.user.entity.User;
import com.lvtn.java.modules.user.repository.AccountRepository;
import com.lvtn.java.modules.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class ReviewServiceImpl implements ReviewService {

    private final ReviewRepository reviewRepository;
    private final UserRepository userRepository;
    private final AccountRepository accountRepository;
    private final TourRepository tourRepository;
    private final BookingRepository bookingRepository;
    private final ModelMapper mapper;

    private ReviewResponse mapToResponse(Review review) {
        ReviewResponse response = mapper.map(review, ReviewResponse.class);

        if (review.getUser() != null) {
            response.setUserId(review.getUser().getId());
            response.setUserFullName(review.getUser().getFullName());
        }

        if (review.getTour() != null) {
            response.setTourId(review.getTour().getId());
            response.setTourTitle(review.getTour().getTitle());
        }

        if (review.getBooking() != null) {
            response.setBookingId(review.getBooking().getId());
        }

        if (Boolean.TRUE.equals(review.getIsApproved())) {
            if (review.getApprovedBy() != null) {
                accountRepository.findById(review.getApprovedBy())
                        .ifPresentOrElse(
                                acc -> response.setApprovedByName(acc.getFullName()),
                                () -> response.setApprovedByName("Admin #" + review.getApprovedBy())
                        );
            } else {
                response.setApprovedByName("Tự động");
            }
        } else {
            response.setApprovedByName("-");
        }

        if (Boolean.TRUE.equals(review.getDeleted())) {
            if (review.getDeletedBy() != null) {
                accountRepository.findById(review.getDeletedBy())
                        .ifPresentOrElse(
                                acc -> response.setDeletedByName(acc.getFullName()),
                                () -> response.setDeletedByName("Admin #" + review.getDeletedBy())
                        );
            } else {
                response.setDeletedByName("Hệ thống");
            }
        }

        return response;
    }

    @Override
    public List<ReviewResponse> findAll() {
        return reviewRepository.findByDeletedFalse().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<ReviewResponse> findApprovedByTour(Integer tourId) {
        return reviewRepository.findByTourIdAndDeletedFalseAndIsApprovedTrue(tourId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public ReviewResponse create(ReviewRequest request, Integer userId) {
        Review review = mapper.map(request, Review.class);

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Tour tour = tourRepository.findById(request.getTourId())
                .orElseThrow(() -> new RuntimeException("Tour not found"));
        Booking booking = bookingRepository.findById(request.getBookingId())
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        review.setUser(user);
        review.setTour(tour);
        review.setBooking(booking);
        review.setIsApproved(false);
        review.setDeleted(false);

        Review savedReview = reviewRepository.save(review);
        return mapToResponse(savedReview);
    }

    @Override
    public ReviewResponse toggleVisibility(Integer id, Integer adminId) {
        Review review = reviewRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Review not found"));

        boolean currentStatus = review.getIsApproved() != null && review.getIsApproved();
        review.setIsApproved(!currentStatus);
        review.setApprovedBy(adminId);

        Review updatedReview = reviewRepository.save(review);
        return mapToResponse(updatedReview);
    }

    @Override
    public void delete(Integer id, Integer adminId) {
        Review review = reviewRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Review not found"));

        review.setDeleted(true);
        review.setDeletedBy(adminId);

        reviewRepository.save(review);
    }

    @Override
    public List<ReviewResponse> getTrash() {
        return reviewRepository.findByDeletedTrue().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public ReviewResponse restore(Integer id, Integer adminId) {
        Review review = reviewRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Review not found"));

        review.setDeleted(false);
        review.setDeletedBy(null);

        Review updatedReview = reviewRepository.save(review);
        return mapToResponse(updatedReview);
    }

    @Override
    public void hardDelete(Integer id) {
        Review review = reviewRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Review not found"));
        reviewRepository.delete(review);
    }
}