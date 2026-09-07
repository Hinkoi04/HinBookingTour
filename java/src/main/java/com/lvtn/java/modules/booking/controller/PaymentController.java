package com.lvtn.java.modules.booking.controller;

import com.lvtn.java.common.ApiResponse;
import com.lvtn.java.dto.booking.PaymentResponse;
import com.lvtn.java.dto.booking.PaymentStatusUpdateRequest;
import com.lvtn.java.modules.booking.service.PaymentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;

    @PutMapping("/{id}/confirm")
    @PreAuthorize("@permissionCheckService.hasPermission(principal.accountId(), 'UPDATE_BOOKING')")
    public ResponseEntity<ApiResponse<PaymentResponse>> confirmPayment(@PathVariable Integer id) {
        return ResponseEntity.ok(ApiResponse.success(paymentService.confirmPayment(id)));
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("@permissionCheckService.hasPermission(principal.accountId(), 'UPDATE_BOOKING')")
    public ResponseEntity<ApiResponse<PaymentResponse>> updateStatus(
            @PathVariable Integer id,
            @Valid @RequestBody PaymentStatusUpdateRequest request) {
        return ResponseEntity.ok(ApiResponse.success(paymentService.updateStatus(id, request.getStatus())));
    }
}