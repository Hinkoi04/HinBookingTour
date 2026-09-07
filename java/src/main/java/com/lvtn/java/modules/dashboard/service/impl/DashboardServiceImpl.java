package com.lvtn.java.modules.dashboard.service.impl;

import com.lvtn.java.dto.dashboard.DashboardResponse;
import com.lvtn.java.modules.dashboard.service.DashboardService;
import com.lvtn.java.modules.booking.repository.BookingRepository;
import com.lvtn.java.modules.tour.repository.TourRepository;
import com.lvtn.java.modules.user.repository.AccountRepository;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.YearMonth;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class DashboardServiceImpl implements DashboardService {

    private final BookingRepository bookingRepository;
    private final TourRepository tourRepository;
    private final AccountRepository accountRepository;

    @Override
    public DashboardResponse getSummary() {

        YearMonth currentMonth = YearMonth.now();
        LocalDateTime startOfThisMonth = currentMonth.atDay(1).atStartOfDay();
        LocalDateTime endOfThisMonth = currentMonth.atEndOfMonth().atTime(23, 59, 59);

        YearMonth lastMonth = currentMonth.minusMonths(1);
        LocalDateTime startOfLastMonth = lastMonth.atDay(1).atStartOfDay();
        LocalDateTime endOfLastMonth = lastMonth.atEndOfMonth().atTime(23, 59, 59);


        BigDecimal revThisMonthBD = bookingRepository.sumRevenueBetween(startOfThisMonth, endOfThisMonth);
        BigDecimal revLastMonthBD = bookingRepository.sumRevenueBetween(startOfLastMonth, endOfLastMonth);

        long revenueThisMonth = revThisMonthBD != null ? revThisMonthBD.longValue() : 0L;
        long revenueLastMonth = revLastMonthBD != null ? revLastMonthBD.longValue() : 0L;
        String growthStr = calculateGrowth(revenueThisMonth, revenueLastMonth);

        DashboardResponse.Metric revenue = DashboardResponse.Metric.builder()
                .value(revenueThisMonth)
                .growth(growthStr)
                .build();

        long totalBookingsCount = bookingRepository.count();
        long pendingBookings = bookingRepository.countByStatus("pending");

        DashboardResponse.BookingMetric totalBookings = DashboardResponse.BookingMetric.builder()
                .value(totalBookingsCount)
                .pending(pendingBookings + " đơn chờ xác nhận")
                .build();

        long totalCustomers = accountRepository.countByDeletedFalse();
        long newCustomersThisMonth = accountRepository.countByCreatedAtBetween(startOfThisMonth, endOfThisMonth);

        DashboardResponse.CustomerMetric customers = DashboardResponse.CustomerMetric.builder()
                .value(totalCustomers)
                .newThisMonth("+" + newCustomersThisMonth + " khách mới tháng này")
                .build();

        long totalActiveTours = tourRepository.countByDeletedFalse();
        int totalCategories = 0;
        try {
            totalCategories = tourRepository.countDistinctCategories();
        } catch (Exception e) {
            totalCategories = 0;
        }

        DashboardResponse.TourMetric totalTours = DashboardResponse.TourMetric.builder()
                .value(totalActiveTours)
                .categories(totalCategories)
                .build();

        DashboardResponse.StatCards statCards = DashboardResponse.StatCards.builder()
                .revenue(revenue)
                .totalBookings(totalBookings)
                .customers(customers)
                .totalTours(totalTours)
                .build();


        List<DashboardResponse.RevenueData> revenueDataList = new ArrayList<>();
        for (int i = 5; i >= 0; i--) {
            YearMonth targetMonth = currentMonth.minusMonths(i);
            LocalDateTime start = targetMonth.atDay(1).atStartOfDay();
            LocalDateTime end = targetMonth.atEndOfMonth().atTime(23, 59, 59);

            BigDecimal revBD = bookingRepository.sumRevenueBetween(start, end);
            long rev = revBD != null ? revBD.longValue() : 0L;
            String monthLabel = "T" + targetMonth.getMonthValue(); // Format ra chữ "T1", "T2"...

            revenueDataList.add(DashboardResponse.RevenueData.builder()
                    .month(monthLabel)
                    .revenue(rev)
                    .build());
        }


        List<Object[]> topToursRaw = bookingRepository.findTopTours(PageRequest.of(0, 5));
        List<DashboardResponse.TopTour> topTours = topToursRaw.stream().map(obj ->
                DashboardResponse.TopTour.builder()
                        .name((String) obj[0])
                        .bookings(((Number) obj[1]).intValue())
                        .revenue(obj[2] != null ? ((BigDecimal) obj[2]).longValue() : 0L)
                        .build()
        ).collect(Collectors.toList());


        List<Object[]> statusRaw = bookingRepository.countBookingsByStatus();
        List<DashboardResponse.BookingStatus> bookingStatusList = statusRaw.stream().map(obj -> {
            String status = (String) obj[0];
            long count = ((Number) obj[1]).longValue();

            String color = "#9ca3af"; // Xám mặc định
            String displayStatus = status;

            if (status == null) status = "UNKNOWN";

            if ("CONFIRMED".equalsIgnoreCase(status) || "PAID".equalsIgnoreCase(status)) {
                color = "#10b981"; // Xanh lá
                displayStatus = "Đã xác nhận";
            } else if ("PENDING".equalsIgnoreCase(status)) {
                color = "#f59e0b"; // Vàng cam
                displayStatus = "Chờ xử lý";
            } else if ("CANCELLED".equalsIgnoreCase(status) || "FAILED".equalsIgnoreCase(status)) {
                color = "#ef4444"; // Đỏ
                displayStatus = "Đã hủy";
            }else if ("COMPLETED".equalsIgnoreCase(status)) {
                color = "#8b5cf6"; // Tím
                displayStatus = "Đã hoàn thành";
            } else {
                displayStatus = status.substring(0, 1).toUpperCase() + status.substring(1).toLowerCase();
            }

            return DashboardResponse.BookingStatus.builder()
                    .name(displayStatus)
                    .value(count)
                    .color(color)
                    .build();
        }).collect(Collectors.toList());


        return DashboardResponse.builder()
                .statCards(statCards)
                .revenueData(revenueDataList)
                .topTours(topTours)
                .bookingStatus(bookingStatusList)
                .build();
    }

    // --- HÀM PHỤ TRỢ ---
    private String calculateGrowth(long current, long last) {
        if (last == 0) {
            return current > 0 ? "+100% so với tháng trước" : "0% so với tháng trước";
        }
        double percentage = ((double) (current - last) / last) * 100;
        String sign = percentage > 0 ? "+" : "";
        return String.format("%s%.1f%% so với tháng trước", sign, percentage);
    }
}