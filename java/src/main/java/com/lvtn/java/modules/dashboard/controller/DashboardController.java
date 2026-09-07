package com.lvtn.java.modules.dashboard.controller;

import com.lvtn.java.dto.dashboard.DashboardResponse;
import com.lvtn.java.modules.dashboard.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping("/summary")
    // @PreAuthorize("@permissionCheckService.hasPermission(principal.accountId(), 'VIEW_DASHBOARD')") // Bỏ comment dòng này nếu bạn có module phân quyền cho dashboard
    public ResponseEntity<DashboardResponse> getDashboardSummary() {
        return ResponseEntity.ok(dashboardService.getSummary());
    }
}