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
    @Query("SELECT b FROM Booking b LEFT JOIN FETCH b.departure d LEFT JOIN FETCH d.tourId LEFT JOIN FETCH b.user WHERE (b.deleted = false OR b.deleted IS NULL)")
    List<Booking> findByDeletedFalse();

    @Query("SELECT b FROM Booking b JOIN b.departure d WHERE d.startTime < :cutoff " +
            "AND (b.deleted = false OR b.deleted IS NULL) " +
            "AND LOWER(COALESCE(b.status, 'pending')) NOT IN ('cancelled', 'completed')")
    List<Booking> findOverdueBookings(@Param("cutoff") LocalDateTime cutoff);

    @Query("SELECT b FROM Booking b LEFT JOIN FETCH b.departure d LEFT JOIN FETCH d.tourId LEFT JOIN FETCH b.user WHERE b.id = :id")
    Optional<Booking> findByIdWithDetails(@Param("id") Integer id);

    @Query("SELECT b FROM Booking b LEFT JOIN FETCH b.departure d LEFT JOIN FETCH d.tourId WHERE LOWER(b.email) = LOWER(:email) AND (b.deleted = false OR b.deleted IS NULL) ORDER BY b.createdAt DESC")
    List<Booking> findHistoryByEmail(@Param("email") String email);

    @Query("SELECT b FROM Booking b LEFT JOIN FETCH b.departure d WHERE d.id = :departureId AND (b.deleted = false OR b.deleted IS NULL) AND (LOWER(b.status) = 'confirmed' OR LOWER(b.status) = 'completed')")
    List<Booking> findByDepartureIdWithDetails(@Param("departureId") Integer departureId);

    Optional<Booking> findByBookingCode(String bookingCode);

    long count();
    long countByStatus(String status);

    @Query("SELECT COALESCE(SUM(b.total), 0) FROM Booking b WHERE b.status = 'CONFIRMED' AND b.createdAt BETWEEN :startDate AND :endDate")
    BigDecimal sumRevenueBetween(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);

    @Query("SELECT COALESCE(SUM(b.total), 0) FROM Booking b WHERE b.status = 'CONFIRMED' " +
            "AND b.createdAt >= :startDate AND b.createdAt < :endDate " +
            "AND (b.deleted = false OR b.deleted IS NULL)")
    BigDecimal sumRevenueBetweenAndNotDeleted(
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate);

    @Query("SELECT COUNT(b.id) FROM Booking b WHERE b.createdAt >= :startDate AND b.createdAt < :endDate " +
            "AND (b.deleted = false OR b.deleted IS NULL)")
    long countCreatedBetweenAndNotDeleted(
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate);

    @Query("SELECT COUNT(b.id) FROM Booking b WHERE LOWER(b.status) = LOWER(:status) " +
            "AND b.createdAt >= :startDate AND b.createdAt < :endDate " +
            "AND (b.deleted = false OR b.deleted IS NULL)")
    long countByStatusAndCreatedBetweenAndNotDeleted(
            @Param("status") String status,
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate);

    @Query("SELECT FUNCTION('YEAR', b.createdAt), FUNCTION('MONTH', b.createdAt), " +
            "FUNCTION('DAY', b.createdAt), SUM(b.total) FROM Booking b " +
            "WHERE b.status = 'CONFIRMED' AND b.createdAt >= :startDate AND b.createdAt < :endDate " +
            "AND (b.deleted = false OR b.deleted IS NULL) " +
            "GROUP BY FUNCTION('YEAR', b.createdAt), FUNCTION('MONTH', b.createdAt), FUNCTION('DAY', b.createdAt)")
    List<Object[]> sumRevenueDailyBetween(
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate);

    @Query("SELECT FUNCTION('YEAR', b.createdAt), FUNCTION('MONTH', b.createdAt), SUM(b.total) " +
            "FROM Booking b WHERE b.status = 'CONFIRMED' AND b.createdAt >= :startDate " +
            "GROUP BY FUNCTION('YEAR', b.createdAt), FUNCTION('MONTH', b.createdAt)")
    List<Object[]> sumRevenueMonthlyFrom(@Param("startDate") LocalDateTime startDate);

    // Thống kê trạng thái đơn hàng
    @Query("SELECT b.status, COUNT(b.id) FROM Booking b GROUP BY b.status")
    List<Object[]> countBookingsByStatus();

    @Query("SELECT b.status, COUNT(b.id) FROM Booking b " +
            "WHERE b.createdAt >= :startDate AND b.createdAt < :endDate " +
            "AND (b.deleted = false OR b.deleted IS NULL) GROUP BY b.status")
    List<Object[]> countBookingsByStatusBetween(
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate);

    // Top 5 Tour bán chạy nhất
    // Giả định trong entity Departure, biến liên kết với Tour tên là 'tourId' hoặc 'tour'
    // Tùy vào Entity Departure của bạn, hãy sửa "d.tour" thành tên biến chính xác nhé!
    @Query("SELECT t.title, COUNT(b.id), SUM(b.total) " +
            "FROM Booking b JOIN b.departure d JOIN d.tourId t " + // Đã sửa thành d.tourId
            "WHERE b.status = 'CONFIRMED' " +
            "GROUP BY t.id, t.title " +
            "ORDER BY COUNT(b.id) DESC")
    List<Object[]> findTopTours(Pageable pageable);

    @Query("SELECT t.title, COUNT(b.id), SUM(b.total) " +
            "FROM Booking b JOIN b.departure d JOIN d.tourId t " +
            "WHERE b.status = 'CONFIRMED' AND b.createdAt >= :startDate AND b.createdAt < :endDate " +
            "AND (b.deleted = false OR b.deleted IS NULL) " +
            "GROUP BY t.id, t.title ORDER BY COUNT(b.id) DESC")
    List<Object[]> findTopToursBetween(
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate,
            Pageable pageable);
}