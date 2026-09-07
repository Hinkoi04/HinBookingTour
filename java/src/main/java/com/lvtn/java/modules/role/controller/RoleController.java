package com.lvtn.java.modules.role.controller;

import com.lvtn.java.dto.role.RoleRequest;
import com.lvtn.java.dto.role.UpdateRolePermissionRequest;
import com.lvtn.java.modules.role.service.RoleService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/api/roles")
@RequiredArgsConstructor
public class RoleController {

    private final RoleService roleService;

    @GetMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> getAllRoles() {
        return ResponseEntity.ok(roleService.getAllRoles());
    }

    @GetMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> getRoleById(@PathVariable Integer id) {
        try {
            return ResponseEntity.ok(roleService.getRoleById(id));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping
    @PreAuthorize("@permissionCheckService.hasPermission(principal.accountId(), 'CREATE_ROLE')")
    public ResponseEntity<?> createRole(@RequestBody RoleRequest request) {
        return ResponseEntity.ok(roleService.createRole(request));
    }

    @PutMapping("/{id}")
    @PreAuthorize("@permissionCheckService.hasPermission(principal.accountId(), 'UPDATE_ROLE')")
    public ResponseEntity<?> updateRole(@PathVariable Integer id, @RequestBody RoleRequest request) {
        try {
            return ResponseEntity.ok(roleService.updateRole(id, request));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("@permissionCheckService.hasPermission(principal.accountId(), 'DELETE_ROLE')")
    public ResponseEntity<?> deleteRole(@PathVariable Integer id) {
        try {
            roleService.deleteRole(id);
            return ResponseEntity.ok("Đã xóa vai trò thành công!");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/{id}/restore")
    @PreAuthorize("@permissionCheckService.hasPermission(principal.accountId(), 'UPDATE_ROLE')")
    public ResponseEntity<?> restoreRole(@PathVariable Integer id) {
        try {
            roleService.restoreRole(id);
            return ResponseEntity.ok("Đã mở khóa vai trò thành công!");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/{id}/permissions")
    @PreAuthorize("@permissionCheckService.hasPermission(principal.accountId(), 'UPDATE_ROLE')")
    public ResponseEntity<?> updateRolePermissions(
            @PathVariable Integer id,
            @RequestBody UpdateRolePermissionRequest request) {
        try {
            roleService.updatePermissions(id, request.getPermissionIds());
            return ResponseEntity.ok("Cập nhật phân quyền thành công!");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}