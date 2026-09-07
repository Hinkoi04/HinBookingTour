package com.lvtn.java.dto.dashboard;

import lombok.Builder;
import lombok.Data;
import java.util.List;

@Data
@Builder
public class DashboardResponse {
    private StatCards statCards;
    private List<RevenueData> revenueData;
    private List<TopTour> topTours;
    private List<BookingStatus> bookingStatus;

    @Data @Builder
    public static class StatCards {
        private Metric revenue;
        private BookingMetric totalBookings;
        private CustomerMetric customers;
        private TourMetric totalTours;
    }

    @Data @Builder
    public static class Metric {
        private long value;
        private String growth;
    }

    @Data @Builder
    public static class BookingMetric {
        private long value;
        private String pending;
    }

    @Data @Builder
    public static class CustomerMetric {
        private long value;
        private String newThisMonth;
    }

    @Data @Builder
    public static class TourMetric {
        private long value;
        private int categories;
    }

    @Data @Builder
    public static class RevenueData {
        private String month;
        private long revenue;
    }

    @Data @Builder
    public static class TopTour {
        private String name;
        private int bookings;
        private long revenue;
    }

    @Data @Builder
    public static class BookingStatus {
        private String name;
        private long value;
        private String color;
    }
}