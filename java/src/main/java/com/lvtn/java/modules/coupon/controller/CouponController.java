package com.lvtn.java.modules.coupon.controller;

import com.lvtn.java.dto.coupon.CouponRequest;
import com.lvtn.java.dto.coupon.CouponResponse;
import com.lvtn.java.security.SecurityUtils;
import com.lvtn.java.modules.coupon.service.CouponService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/coupon")
@RequiredArgsConstructor
public class CouponController {

    private final CouponService couponService;
    private final SecurityUtils securityUtils;

    @GetMapping
    public ResponseEntity<List<CouponResponse>> getAllActive() {
        return ResponseEntity.ok(couponService.findAllActive());
    }

    @PostMapping
    @PreAuthorize("@permissionCheckService.hasPermission(principal.accountId(), 'CREATE_COUPON')")
    public ResponseEntity<CouponResponse> create(@RequestBody CouponRequest request) {
        Integer creatorId = securityUtils.getCurrentAccountId();
        return ResponseEntity.ok(couponService.create(request, creatorId));
    }

    @PutMapping("/{id}")
    @PreAuthorize("@permissionCheckService.hasPermission(principal.accountId(), 'UPDATE_COUPON')")
    public ResponseEntity<CouponResponse> update(@PathVariable Integer id, @RequestBody CouponRequest request) {
        Integer updaterId = securityUtils.getCurrentAccountId();
        return ResponseEntity.ok(couponService.update(id, request, updaterId));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("@permissionCheckService.hasPermission(principal.accountId(), 'DELETE_COUPON')")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        Integer deleterId = securityUtils.getCurrentAccountId();
        couponService.delete(id, deleterId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/trash")
    @PreAuthorize("@permissionCheckService.hasPermission(principal.accountId(), 'COUPON_TRASH')")
    public ResponseEntity<List<CouponResponse>> getTrash() {
        return ResponseEntity.ok(couponService.findDeleted());
    }

    @PutMapping("/{id}/restore")
    @PreAuthorize("@permissionCheckService.hasPermission(principal.accountId(), 'COUPON_TRASH')")
    public ResponseEntity<CouponResponse> restore(@PathVariable Integer id) {
        Integer restorerId = securityUtils.getCurrentAccountId();
        return ResponseEntity.ok(couponService.restore(id, restorerId));
    }

    @DeleteMapping("/{id}/force")
    @PreAuthorize("@permissionCheckService.hasPermission(principal.accountId(), 'COUPON_TRASH')")
    public ResponseEntity<Void> hardDelete(@PathVariable Integer id) {
        couponService.hardDelete(id);
        return ResponseEntity.noContent().build();
    }
}