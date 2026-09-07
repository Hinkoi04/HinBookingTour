package com.lvtn.java.dto.booking;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PaymentResponse {
    private Integer id;
    private String transactionId;
    private String paymentMethod;
    private String paymentType;
    private BigDecimal amount;
    private String paymentStatus;
    private LocalDateTime paidAt;
}