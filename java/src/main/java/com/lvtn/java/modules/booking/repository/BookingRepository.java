package com.lvtn.java.modules.booking.repository;

import com.lvtn.java.modules.booking.entity.Booking;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface BookingRepository extends JpaRepository<Booking, Integer> {
    List<Booking> findByDeletedFalse();
    Optional<Booking> findByBookingCode(String bookingCode);

    long count();
    long countByStatus(String status);

    @Query("SELECT COALESCE(SUM(b.total), 0) FROM Booking b WHERE b.status = 'CONFIRMED' AND b.createdAt BETWEEN :startDate AND :endDate")
    BigDecimal sumRevenueBetween(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);

    // Thống kê trạng thái đơn hàng
    @Query("SELECT b.status, COUNT(b.id) FROM Booking b GROUP BY b.status")
    List<Object[]> countBookingsByStatus();

    // Top 5 Tour bán chạy nhất
    // Giả định trong entity Departure, biến liên kết với Tour tên là 'tourId' hoặc 'tour'
    // Tùy vào Entity Departure của bạn, hãy sửa "d.tour" thành tên biến chính xác nhé!
    @Query("SELECT t.title, COUNT(b.id), SUM(b.total) " +
            "FROM Booking b JOIN b.departure d JOIN d.tourId t " + // Đã sửa thành d.tourId
            "WHERE b.status = 'CONFIRMED' " +
            "GROUP BY t.id, t.title " +
            "ORDER BY COUNT(b.id) DESC")
    List<Object[]> findTopTours(Pageable pageable);
}