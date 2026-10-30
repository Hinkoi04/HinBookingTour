package com.lvtn.java.dto.booking;

import java.math.BigDecimal;

public record BookingPaymentResponse(
        String bookingCode,
        BigDecimal total,
        BigDecimal paymentAmount,
        String bookingStatus,
        String paymentStatus) {
}
