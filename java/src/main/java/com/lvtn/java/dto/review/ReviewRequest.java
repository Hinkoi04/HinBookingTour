package com.lvtn.java.dto.review;

import lombok.Data;

@Data
public class ReviewRequest {
    private Integer tourId;
    private Integer bookingId;
    private Integer rating;
    private String content;
}