package com.lvtn.java.modules.booking.service.impl;

import com.lvtn.java.common.exception.BadRequestException;
import com.lvtn.java.common.exception.NotFoundException;
import com.lvtn.java.dto.booking.BookingPaymentRequest;
import com.lvtn.java.dto.booking.BookingPaymentResponse;
import com.lvtn.java.dto.booking.PaymentResponse;
import com.lvtn.java.modules.booking.entity.Booking;
import com.lvtn.java.modules.booking.entity.Passenger;
import com.lvtn.java.modules.booking.entity.Payment;
import com.lvtn.java.modules.booking.repository.BookingRepository;
import com.lvtn.java.modules.booking.repository.PaymentRepository;
import com.lvtn.java.modules.booking.service.PaymentService;
import com.lvtn.java.modules.tripDetails.entity.Departure;
import com.lvtn.java.modules.tripDetails.repository.DepartureRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;
import java.util.Set;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class PaymentServiceImpl implements PaymentService {

    private static final Set<String> ALLOWED_STATUSES = Set.of("pending", "paid", "failed", "refunded");
    private static final Set<String> FINAL_STATUSES = Set.of("refunded");

    private final PaymentRepository paymentRepository;
    private final BookingRepository bookingRepository;
    private final DepartureRepository departureRepository;

    @Override
    @Transactional
    public BookingPaymentResponse createBookingAndPayment(BookingPaymentRequest request) {
        Departure departure = departureRepository.findByIdForBooking(request.departureId())
                .orElseThrow(() -> new NotFoundException("Không tìm thấy lịch khởi hành"));

        if (departure.getTourId() == null) {
            throw new BadRequestException("Lịch khởi hành chưa được gán tour");
        }
        if (!"active".equalsIgnoreCase(departure.getStatus())) {
            throw new BadRequestException("Lịch khởi hành hiện không nhận đặt tour");
        }
        if (request.adults() > departure.getStockAdult()
                || request.children() > departure.getStockChildren()
                || request.babies() > departure.getStockBaby()) {
            throw new BadRequestException("Số lượng hành khách vượt quá số chỗ còn lại");
        }
        if (request.passengers().size() != request.adults() + request.children() + request.babies()) {
            throw new BadRequestException("Số hành khách không khớp với số lượng đã chọn");
        }

        String paymentMethod = request.paymentMethod().toLowerCase();
        if (!Set.of("bank", "momo", "zalopay", "card", "cod").contains(paymentMethod)) {
            throw new BadRequestException("Phương thức thanh toán không hợp lệ");
        }
        String paymentPlan = request.paymentPlan().toLowerCase();
        if (!Set.of("half", "full", "cod").contains(paymentPlan)) {
            throw new BadRequestException("Hình thức thanh toán không hợp lệ");
        }

        BigDecimal adultPrice = priceOrZero(departure.getPriceAdult());
        BigDecimal childrenPrice = priceOrZero(departure.getPriceChildren());
        BigDecimal babyPrice = priceOrZero(departure.getPriceBaby());
        BigDecimal total = adultPrice.multiply(BigDecimal.valueOf(request.adults()))
                .add(childrenPrice.multiply(BigDecimal.valueOf(request.children())))
                .add(babyPrice.multiply(BigDecimal.valueOf(request.babies())));
        String effectivePlan = "cod".equals(paymentMethod) ? "cod" : paymentPlan;
        BigDecimal paymentAmount = switch (effectivePlan) {
            case "full" -> total;
            case "half" -> total.divide(BigDecimal.valueOf(2), 0, java.math.RoundingMode.HALF_UP);
            default -> BigDecimal.ZERO;
        };

        BookingPaymentRequest.Customer customer = request.customer();
        Booking booking = new Booking();
        booking.setBookingCode("TG" + UUID.randomUUID().toString().replace("-", "").substring(0, 10).toUpperCase());
        booking.setFullName(customer.fullName().trim());
        booking.setEmail(customer.email().trim());
        booking.setPhone(customer.phone().trim());
        booking.setAddress(customer.address());
        booking.setNote(customer.notes());
        booking.setDeparture(departure);
        booking.setQuantityAdult(request.adults());
        booking.setQuantityChildren(request.children());
        booking.setQuantityBaby(request.babies());
        booking.setAdultPrice(adultPrice);
        booking.setChildrenPrice(childrenPrice);
        booking.setBabyPrice(babyPrice);
        booking.setSubTotal(total);
        booking.setTotal(total);
        booking.setStatus("pending");
        booking.setDeleted(false);

        List<Passenger> passengers = request.passengers().stream()
                .map(item -> {
                    if (!Set.of("adult", "children", "baby").contains(item.type().toLowerCase())) {
                        throw new BadRequestException("Loại hành khách không hợp lệ");
                    }
                    Passenger passenger = new Passenger();
                    passenger.setBooking(booking);
                    passenger.setFullName(item.fullName().trim());
                    passenger.setDob(item.dob());
                    passenger.setGender(item.gender());
                    passenger.setIdentityCard(item.idCard());
                    passenger.setPhone(item.phone());
                    passenger.setPassengerType(item.type().toLowerCase());
                    return passenger;
                })
                .toList();
        booking.setPassengers(passengers);
        Booking savedBooking = bookingRepository.save(booking);

        Payment payment = new Payment();
        payment.setBooking(savedBooking);
        payment.setTransactionId(savedBooking.getBookingCode());
        payment.setPaymentMethod(paymentMethod);
        payment.setPaymentType(effectivePlan);
        payment.setAmount(paymentAmount);
        payment.setPaymentStatus("pending");
        paymentRepository.save(payment);

        departure.setStockAdult(departure.getStockAdult() - request.adults());
        departure.setStockChildren(departure.getStockChildren() - request.children());
        departure.setStockBaby(departure.getStockBaby() - request.babies());
        departureRepository.save(departure);

        return new BookingPaymentResponse(
                savedBooking.getBookingCode(), total, paymentAmount, savedBooking.getStatus(), payment.getPaymentStatus());
    }

    private BigDecimal priceOrZero(BigDecimal price) {
        return price == null ? BigDecimal.ZERO : price;
    }

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