package com.lvtn.java.modules.booking.service.impl;

import com.lvtn.java.common.exception.BadRequestException;
import com.lvtn.java.common.exception.NotFoundException;
import com.lvtn.java.dto.booking.PaymentResponse;
import com.lvtn.java.modules.booking.entity.Booking;
import com.lvtn.java.modules.booking.entity.Payment;
import com.lvtn.java.modules.booking.repository.BookingRepository;
import com.lvtn.java.modules.booking.repository.PaymentRepository;
import com.lvtn.java.modules.booking.service.PaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Set;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class PaymentServiceImpl implements PaymentService {

    private static final Set<String> ALLOWED_STATUSES = Set.of("pending", "paid", "failed", "refunded");
    private static final Set<String> FINAL_STATUSES = Set.of("refunded");

    private final PaymentRepository paymentRepository;
    private final BookingRepository bookingRepository;

    private PaymentResponse mapToResponse(Payment payment) {
        return new PaymentResponse(
                payment.getId(),
                payment.getTransactionId(),
                payment.getPaymentMethod(),
                payment.getPaymentType(),
                payment.getAmount(),
                payment.getPaymentStatus(),
                payment.getPaidAt()
        );
    }

    @Override
    @Transactional
    public PaymentResponse confirmPayment(Integer paymentId) {
        return updateStatus(paymentId, "paid");
    }

    @Override
    @Transactional
    public PaymentResponse updateStatus(Integer paymentId, String newStatus) {
        if (newStatus == null || !ALLOWED_STATUSES.contains(newStatus.toLowerCase())) {
            throw new BadRequestException("Trạng thái thanh toán không hợp lệ! Chỉ chấp nhận: " + ALLOWED_STATUSES);
        }
        String status = newStatus.toLowerCase();

        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new NotFoundException("Không tìm thấy giao dịch thanh toán với ID: " + paymentId));

        if (payment.getPaymentStatus() != null && FINAL_STATUSES.contains(payment.getPaymentStatus().toLowerCase())) {
            throw new BadRequestException(
                    "Giao dịch đã ở trạng thái cuối (\"" + payment.getPaymentStatus() + "\"), không thể đổi trạng thái nữa!");
        }

        payment.setPaymentStatus(status);
        if ("paid".equals(status)) {
            payment.setPaidAt(LocalDateTime.now());
        }
        Payment savedPayment = paymentRepository.save(payment);
        Booking booking = payment.getBooking();
        if (booking != null && "paid".equals(status) && "pending".equals(booking.getStatus())) {
            booking.setStatus("confirmed");
            bookingRepository.save(booking);
        }

        return mapToResponse(savedPayment);
    }
}