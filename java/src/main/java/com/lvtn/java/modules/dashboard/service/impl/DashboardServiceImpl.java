package com.lvtn.java.modules.dashboard.service.impl;

import com.lvtn.java.dto.dashboard.DashboardResponse;
import com.lvtn.java.modules.booking.repository.BookingRepository;
import com.lvtn.java.modules.dashboard.service.DashboardService;
import com.lvtn.java.modules.tour.repository.TourRepository;
import com.lvtn.java.modules.user.repository.AccountRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.YearMonth;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.time.temporal.ChronoUnit;
import java.time.temporal.TemporalAdjusters;
import java.time.DayOfWeek;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class DashboardServiceImpl implements DashboardService {

    private static final DateTimeFormatter DATE_LABEL = DateTimeFormatter.ofPattern("dd/MM/yyyy");
    private static final DateTimeFormatter DAY_LABEL = DateTimeFormatter.ofPattern("dd/MM");

    private final BookingRepository bookingRepository;
    private final TourRepository tourRepository;
    private final AccountRepository accountRepository;

    @Override
    public DashboardResponse getSummary(String period, String date) {
        String normalizedPeriod = period.toLowerCase(Locale.ROOT);
        LocalDate anchorDate = parseDate(date);
        DateRange range = getDateRange(normalizedPeriod, anchorDate);
        LocalDateTime start = range.start().atStartOfDay();
        LocalDateTime end = range.endExclusive().atStartOfDay();

        BigDecimal revenueValue = bookingRepository.sumRevenueBetweenAndNotDeleted(start, end);
        long revenue = revenueValue != null ? revenueValue.longValue() : 0L;
        long periodDays = ChronoUnit.DAYS.between(range.start(), range.endExclusive());
        LocalDateTime previousStart = start.minusDays(periodDays);
        BigDecimal previousRevenueValue = bookingRepository.sumRevenueBetweenAndNotDeleted(previousStart, start);
        long previousRevenue = previousRevenueValue != null ? previousRevenueValue.longValue() : 0L;

        DashboardResponse.Metric revenueMetric = DashboardResponse.Metric.builder()
                .value(revenue)
                .growth(calculateGrowth(revenue, previousRevenue))
                .build();

        long bookingCount = bookingRepository.countCreatedBetweenAndNotDeleted(start, end);
        long pendingBookings = bookingRepository.countByStatusAndCreatedBetweenAndNotDeleted("pending", start, end);
        DashboardResponse.BookingMetric totalBookings = DashboardResponse.BookingMetric.builder()
                .value(bookingCount)
                .pending(pendingBookings + " đơn chờ xác nhận")
                .build();

        long totalCustomers = accountRepository.countByDeletedFalse();
        long newCustomers = accountRepository.countByCreatedAtBetween(start, end.minusNanos(1));
        DashboardResponse.CustomerMetric customers = DashboardResponse.CustomerMetric.builder()
                .value(totalCustomers)
                .newThisMonth("+" + newCustomers + " khách mới trong kỳ")
                .build();

        long totalActiveTours = tourRepository.countByDeletedFalse();
        int totalCategories = tourRepository.countDistinctCategories();
        DashboardResponse.TourMetric totalTours = DashboardResponse.TourMetric.builder()
                .value(totalActiveTours)
                .categories(totalCategories)
                .build();

        DashboardResponse.StatCards statCards = DashboardResponse.StatCards.builder()
                .revenue(revenueMetric)
                .totalBookings(totalBookings)
                .customers(customers)
                .totalTours(totalTours)
                .build();

        List<DashboardResponse.RevenueData> revenueData = buildRevenueData(
                normalizedPeriod,
                range,
                bookingRepository.sumRevenueDailyBetween(start, end));

        List<DashboardResponse.TopTour> topTours = bookingRepository
                .findTopToursBetween(start, end, PageRequest.of(0, 5))
                .stream()
                .map(row -> DashboardResponse.TopTour.builder()
                        .name((String) row[0])
                        .bookings(((Number) row[1]).intValue())
                        .revenue(row[2] != null ? ((BigDecimal) row[2]).longValue() : 0L)
                        .build())
                .collect(Collectors.toList());

        List<DashboardResponse.BookingStatus> bookingStatus = bookingRepository
                .countBookingsByStatusBetween(start, end)
                .stream()
                .map(this::toBookingStatus)
                .collect(Collectors.toList());

        return DashboardResponse.builder()
                .periodLabel(range.label())
                .statCards(statCards)
                .revenueData(revenueData)
                .topTours(topTours)
                .bookingStatus(bookingStatus)
                .build();
    }

    private LocalDate parseDate(String date) {
        if (date == null || date.isBlank()) {
            return LocalDate.now();
        }
        try {
            return LocalDate.parse(date);
        } catch (DateTimeParseException exception) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Ngày phải có định dạng yyyy-MM-dd", exception);
        }
    }

    private DateRange getDateRange(String period, LocalDate anchorDate) {
        return switch (period) {
            case "day" -> new DateRange(
                    anchorDate,
                    anchorDate.plusDays(1),
                    "Ngày " + DATE_LABEL.format(anchorDate));
            case "week" -> {
                LocalDate start = anchorDate.with(TemporalAdjusters.previousOrSame(DayOfWeek.MONDAY));
                LocalDate end = start.plusWeeks(1);
                yield new DateRange(start, end,
                        "Tuần " + DAY_LABEL.format(start) + " - " + DATE_LABEL.format(end.minusDays(1)));
            }
            case "month" -> {
                YearMonth month = YearMonth.from(anchorDate);
                yield new DateRange(month.atDay(1), month.plusMonths(1).atDay(1),
                        "Tháng " + month.getMonthValue() + "/" + month.getYear());
            }
            case "year" -> {
                LocalDate start = anchorDate.withDayOfYear(1);
                LocalDate end = start.plusYears(1);
                yield new DateRange(start, end, "Năm " + anchorDate.getYear());
            }
            default -> throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST, "Chu kỳ phải là day, week, month hoặc year");
        };
    }

    private List<DashboardResponse.RevenueData> buildRevenueData(
            String period, DateRange range, List<Object[]> dailyRevenueRows) {
        Map<LocalDate, Long> dailyRevenue = new HashMap<>();
        for (Object[] row : dailyRevenueRows) {
            LocalDate date = LocalDate.of(
                    ((Number) row[0]).intValue(),
                    ((Number) row[1]).intValue(),
                    ((Number) row[2]).intValue());
            dailyRevenue.put(date, ((BigDecimal) row[3]).longValue());
        }

        List<DashboardResponse.RevenueData> data = new ArrayList<>();
        if ("year".equals(period)) {
            YearMonth month = YearMonth.from(range.start());
            YearMonth lastMonth = YearMonth.from(range.endExclusive().minusDays(1));
            while (!month.isAfter(lastMonth)) {
                long total = 0L;
                for (LocalDate day = month.atDay(1);
                     day.isBefore(month.plusMonths(1).atDay(1));
                     day = day.plusDays(1)) {
                    total += dailyRevenue.getOrDefault(day, 0L);
                }
                data.add(DashboardResponse.RevenueData.builder()
                        .label("Tháng " + month.getMonthValue())
                        .revenue(total)
                        .build());
                month = month.plusMonths(1);
            }
            return data;
        }

        for (LocalDate day = range.start(); day.isBefore(range.endExclusive()); day = day.plusDays(1)) {
            String label = "day".equals(period) ? DATE_LABEL.format(day) : DAY_LABEL.format(day);
            data.add(DashboardResponse.RevenueData.builder()
                    .label(label)
                    .revenue(dailyRevenue.getOrDefault(day, 0L))
                    .build());
        }
        return data;
    }

    private DashboardResponse.BookingStatus toBookingStatus(Object[] row) {
        String status = row[0] != null ? (String) row[0] : "UNKNOWN";
        long count = ((Number) row[1]).longValue();
        String color = "#9ca3af";
        String displayStatus = status;

        if ("CONFIRMED".equalsIgnoreCase(status) || "PAID".equalsIgnoreCase(status)) {
            color = "#10b981";
            displayStatus = "Đã xác nhận";
        } else if ("PENDING".equalsIgnoreCase(status)) {
            color = "#f59e0b";
            displayStatus = "Chờ xử lý";
        } else if ("CANCELLED".equalsIgnoreCase(status) || "FAILED".equalsIgnoreCase(status)) {
            color = "#ef4444";
            displayStatus = "Đã hủy";
        } else if ("COMPLETED".equalsIgnoreCase(status)) {
            color = "#8b5cf6";
            displayStatus = "Đã hoàn thành";
        } else if (!status.isEmpty()) {
            displayStatus = status.substring(0, 1).toUpperCase() + status.substring(1).toLowerCase();
        }

        return DashboardResponse.BookingStatus.builder()
                .name(displayStatus)
                .value(count)
                .color(color)
                .build();
    }

    private String calculateGrowth(long current, long previous) {
        if (previous == 0) {
            return current > 0 ? "+100% so với kỳ trước" : "0% so với kỳ trước";
        }
        double percentage = ((double) (current - previous) / previous) * 100;
        String sign = percentage > 0 ? "+" : "";
        return String.format(Locale.ROOT, "%s%.1f%% so với kỳ trước", sign, percentage);
    }

    private record DateRange(LocalDate start, LocalDate endExclusive, String label) {}
}
