package com.lvtn.java.modules.booking.controller;

import com.lvtn.java.common.ApiResponse;
import com.lvtn.java.dto.booking.BookingResponse;
import com.lvtn.java.dto.booking.BookingStatusUpdateRequest;
import com.lvtn.java.modules.booking.service.BookingService;
import com.lvtn.java.security.SecurityUtils;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
public class BookingController {

    private final BookingService bookingService;
    private final SecurityUtils securityUtils;


    @GetMapping
//    @PreAuthorize("@permissionCheckService.hasPermission(principal.accountId(), 'VIEW_BOOKING')")
    public ResponseEntity<ApiResponse<List<BookingResponse>>> getAllActive() {
        return ResponseEntity.ok(ApiResponse.success(bookingService.findAllActive()));
    }

    @GetMapping("/{id}")
    @PreAuthorize("@permissionCheckService.hasPermission(principal.accountId(), 'VIEW_BOOKING')")
    public ResponseEntity<ApiResponse<BookingResponse>> getById(@PathVariable Integer id) {
        return ResponseEntity.ok(ApiResponse.success(bookingService.findById(id)));
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("@permissionCheckService.hasPermission(principal.accountId(), 'UPDATE_BOOKING')")
    public ResponseEntity<ApiResponse<BookingResponse>> updateStatus(
            @PathVariable Integer id,
            @Valid @RequestBody BookingStatusUpdateRequest request) {
        Integer updaterId = securityUtils.getCurrentAccountId();
        return ResponseEntity.ok(ApiResponse.success(
                bookingService.updateStatus(id, request.getStatus(), updaterId)
        ));
    }
}