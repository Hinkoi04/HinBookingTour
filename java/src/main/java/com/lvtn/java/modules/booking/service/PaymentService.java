package com.lvtn.java.modules.booking.service;

import com.lvtn.java.dto.booking.PaymentResponse;

public interface PaymentService {
    PaymentResponse confirmPayment(Integer paymentId);
    PaymentResponse updateStatus(Integer paymentId, String newStatus);
}
