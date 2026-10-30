package com.lvtn.java.modules.booking.service;

import com.lvtn.java.dto.booking.PaymentResponse;
import com.lvtn.java.dto.booking.BookingPaymentRequest;
import com.lvtn.java.dto.booking.BookingPaymentResponse;

public interface PaymentService {
    BookingPaymentResponse createBookingAndPayment(BookingPaymentRequest request);
    PaymentResponse confirmPayment(Integer paymentId);
    PaymentResponse updateStatus(Integer paymentId, String newStatus);
}
