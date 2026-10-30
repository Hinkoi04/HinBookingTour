package com.lvtn.java.dto.booking;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record BookingHistoryResponse(
        Integer id,
        String bookingCode,
        String tourTitle,
        LocalDateTime departureStartDate,
        Integer quantityAdult,
        Integer quantityChildren,
        Integer quantityBaby,
        BigDecimal total,
        String status,
        LocalDateTime createdAt) {
}
