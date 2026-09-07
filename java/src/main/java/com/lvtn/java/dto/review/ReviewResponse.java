package com.lvtn.java.dto.review;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class ReviewResponse {
    private Integer id;
    private Integer userId;
    private String userFullName;
    private Integer tourId;
    private String tourTitle;
    private Integer bookingId;
    private Integer rating;
    private String content;
    private Boolean isApproved;
    private Integer approvedBy;
    private String approvedByName;
    private Boolean deleted;
    private Integer deletedBy;
    private String deletedByName;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}