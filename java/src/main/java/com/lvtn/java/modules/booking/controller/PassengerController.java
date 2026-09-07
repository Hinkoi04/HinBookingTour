package com.lvtn.java.modules.booking.controller;

import com.lvtn.java.common.ApiResponse;
import com.lvtn.java.dto.booking.PassengerResponse;
import com.lvtn.java.dto.booking.PassengerUpdateRequest;
import com.lvtn.java.modules.booking.service.PassengerService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/passengers")
@RequiredArgsConstructor
public class PassengerController {

    private final PassengerService passengerService;

    @GetMapping("/booking/{bookingId}")
    @PreAuthorize("@permissionCheckService.hasPermission(principal.accountId(), 'VIEW_BOOKING')")
    public ResponseEntity<ApiResponse<List<PassengerResponse>>> getByBookingId(@PathVariable Integer bookingId) {
        return ResponseEntity.ok(ApiResponse.success(passengerService.findByBookingId(bookingId)));
    }

    @GetMapping("/{id}")
    @PreAuthorize("@permissionCheckService.hasPermission(principal.accountId(), 'VIEW_BOOKING')")
    public ResponseEntity<ApiResponse<PassengerResponse>> getById(@PathVariable Integer id) {
        return ResponseEntity.ok(ApiResponse.success(passengerService.findById(id)));
    }

    @PutMapping("/{id}")
    @PreAuthorize("@permissionCheckService.hasPermission(principal.accountId(), 'UPDATE_BOOKING')")
    public ResponseEntity<ApiResponse<PassengerResponse>> update(
            @PathVariable Integer id,
            @Valid @RequestBody PassengerUpdateRequest request) {
        return ResponseEntity.ok(ApiResponse.success(passengerService.updatePassenger(id, request)));
    }
}