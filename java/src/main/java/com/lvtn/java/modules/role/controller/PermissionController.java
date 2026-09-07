package com.lvtn.java.modules.role.controller;


import com.lvtn.java.modules.role.service.PermissionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/permissions")
@RequiredArgsConstructor
public class PermissionController {
    private final PermissionService permissionService;

    @GetMapping
    @PreAuthorize("@permissionCheckService.hasPermission(principal.accountId(), 'VIEW_ROLE')")
    public ResponseEntity<?> getAllPermissions() {
        return ResponseEntity.ok(permissionService.getAllPermissions());
    }
}
