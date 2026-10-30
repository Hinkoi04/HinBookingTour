package com.lvtn.java.dto.booking;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;
import java.util.List;

public record BookingPaymentRequest(
        @NotNull Integer departureId,
        @Min(1) int adults,
        @Min(0) int children,
        @Min(0) int babies,
        @NotBlank String paymentPlan,
        @NotBlank String paymentMethod,
        @NotNull @Valid Customer customer,
        @NotNull List<@Valid Passenger> passengers) {

    public record Customer(
            @NotBlank String fullName,
            @NotBlank String email,
            @NotBlank String phone,
            String idNumber,
            String address,
            String notes) {
    }

    public record Passenger(
            @NotBlank String fullName,
            LocalDate dob,
            String gender,
            String idCard,
            String phone,
            @NotBlank String type) {
    }
}
