package com.lvtn.java.dto.booking;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BookingResponse {
    private Integer id;
    private String bookingCode;
    private Integer userId;
    private String fullName;
    private String phone;
    private String email;
    private String address;
    private Integer departureId;
    private String tourTitle;
    private LocalDateTime departureStartDate;
    private Integer couponId;
    private Integer quantityAdult;
    private Integer quantityChildren;
    private Integer quantityBaby;
    private BigDecimal adultPrice;
    private BigDecimal childrenPrice;
    private BigDecimal babyPrice;
    private BigDecimal subTotal;
    private BigDecimal total;
    private BigDecimal discount;
    private String note;
    private String status;
    private Boolean deleted;
    private LocalDateTime deletedAt;
    private Integer deletedBy;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private Integer updatedBy;
    private List<PassengerResponse> passengers;
    private List<PaymentResponse> payments;
}