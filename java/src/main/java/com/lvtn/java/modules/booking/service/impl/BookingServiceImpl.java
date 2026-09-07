package com.lvtn.java.modules.booking.service.impl;

import com.lvtn.java.common.exception.BadRequestException;
import com.lvtn.java.common.exception.NotFoundException;
import com.lvtn.java.dto.booking.BookingResponse;
import com.lvtn.java.dto.booking.PassengerResponse;
import com.lvtn.java.dto.booking.PaymentResponse;
import com.lvtn.java.modules.booking.entity.Booking;
import com.lvtn.java.modules.booking.repository.BookingRepository;
import com.lvtn.java.modules.booking.service.BookingService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class BookingServiceImpl implements BookingService {

    private static final Set<String> ALLOWED_STATUSES = Set.of("confirmed", "pending", "cancelled", "completed");
    private static final Set<String> FINAL_STATUSES = Set.of("cancelled", "completed");

    private final BookingRepository bookingRepository;

    private BookingResponse mapToResponse(Booking booking) {
        List<PassengerResponse> passengers = booking.getPassengers() == null ? List.of() :
                booking.getPassengers().stream().map(p -> new PassengerResponse(
                        p.getId(), p.getFullName(), p.getDob(), p.getGender(),
                        p.getIdentityCard(), p.getPhone(), p.getPassengerType()
                )).toList();

        List<PaymentResponse> payments = booking.getPayments() == null ? List.of() :
                booking.getPayments().stream().map(pm -> new PaymentResponse(
                        pm.getId(), pm.getTransactionId(), pm.getPaymentMethod(),
                        pm.getPaymentType(), pm.getAmount(), pm.getPaymentStatus(), pm.getPaidAt()
                )).toList();

        return BookingResponse.builder()
                .id(booking.getId())
                .bookingCode(booking.getBookingCode())
                .userId(booking.getUser() != null ? booking.getUser().getId() : null)
                .fullName(booking.getFullName())
                .phone(booking.getPhone())
                .email(booking.getEmail())
                .address(booking.getAddress())
                .departureId(booking.getDeparture() != null ? booking.getDeparture().getId() : null)
                .tourTitle(booking.getDeparture() != null && booking.getDeparture().getTourId() != null
                        ? booking.getDeparture().getTourId().getTitle() : null)
                .departureStartDate(booking.getDeparture() != null ? booking.getDeparture().getStartTime() : null)
                .couponId(booking.getCouponId())
                .quantityAdult(booking.getQuantityAdult())
                .quantityChildren(booking.getQuantityChildren())
                .quantityBaby(booking.getQuantityBaby())
                .adultPrice(booking.getAdultPrice())
                .childrenPrice(booking.getChildrenPrice())
                .babyPrice(booking.getBabyPrice())
                .subTotal(booking.getSubTotal())
                .total(booking.getTotal())
                .discount(booking.getDiscount())
                .note(booking.getNote())
                .status(booking.getStatus())
                .deleted(booking.getDeleted())
                .deletedAt(booking.getDeletedAt())
                .deletedBy(booking.getDeletedBy())
                .createdAt(booking.getCreatedAt())
                .updatedAt(booking.getUpdatedAt())
                .updatedBy(booking.getUpdatedBy())
                .passengers(passengers)
                .payments(payments)
                .build();
    }

    @Override
    public List<BookingResponse> findAllActive() {
        return bookingRepository.findByDeletedFalse().stream().map(this::mapToResponse).toList();
    }

    @Override
    public BookingResponse findById(Integer id) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Không tìm thấy booking với ID: " + id));
        if (Boolean.TRUE.equals(booking.getDeleted())) {
            throw new BadRequestException("Booking đã bị xóa!");
        }
        return mapToResponse(booking);
    }

    @Override
    @Transactional
    public BookingResponse updateStatus(Integer id, String newStatus, Integer updaterId) {
        if (newStatus == null || !ALLOWED_STATUSES.contains(newStatus.toLowerCase())) {
            throw new BadRequestException("Trạng thái không hợp lệ! Chỉ chấp nhận: " + ALLOWED_STATUSES);
        }

        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Không tìm thấy booking với ID: " + id));

        if (booking.getStatus() != null && FINAL_STATUSES.contains(booking.getStatus().toLowerCase())) {
            throw new BadRequestException(
                    "Booking đã ở trạng thái cuối (\"" + booking.getStatus() + "\"), không thể đổi trạng thái nữa!");
        }

        booking.setStatus(newStatus.toLowerCase());
        booking.setUpdatedBy(updaterId);
        Booking saved = bookingRepository.save(booking);
        return mapToResponse(saved);
    }
}