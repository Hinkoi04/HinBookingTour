package com.lvtn.java.modules.user.controller;

import com.lvtn.java.dto.user.UserRequest;
import com.lvtn.java.dto.user.UserResponse;
import com.lvtn.java.security.SecurityUtils;
import com.lvtn.java.modules.user.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;
    private final SecurityUtils securityUtils;

    @GetMapping
    public ResponseEntity<List<UserResponse>> getAllActive() {
        return ResponseEntity.ok(userService.findAllActive());
    }

    @GetMapping("/trash")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<UserResponse>> getAllTrash() {
        return ResponseEntity.ok(userService.findAllTrash());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getById(@PathVariable Integer id) {
        try {
            return ResponseEntity.ok(userService.findById(id));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

//    @PostMapping
//    public ResponseEntity<?> create(@RequestBody UserRequest request) {
//        try {
//            Integer accountId = securityUtils.getCurrentAccountId();
//            return ResponseEntity.ok(userService.create(request, accountId));
//        } catch (RuntimeException e) {
//            return ResponseEntity.badRequest().body(e.getMessage());
//        }
//    }

    @PutMapping("/{id}")
//    @PreAuthorize("hasAnyRole('ADMIN','STAFF')")
    public ResponseEntity<?> update(@PathVariable Integer id, @RequestBody UserRequest request) {
        try {
            Integer accountId = securityUtils.getCurrentAccountId();
            return ResponseEntity.ok(userService.update(id, request, accountId));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
//    @PreAuthorize("hasAnyRole('ADMIN','STAFF')")
    public ResponseEntity<?> delete(@PathVariable Integer id) {
        try {
            Integer accountId = securityUtils.getCurrentAccountId();
            userService.delete(id, accountId);
            return ResponseEntity.ok("Khóa tài khoản khách hàng thành công!");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/{id}/restore")
    @PreAuthorize("hasAnyRole('ADMIN','STAFF')")
    public ResponseEntity<?> restore(@PathVariable Integer id) {
        try {
            Integer accountId = securityUtils.getCurrentAccountId();
            userService.restore(id, accountId);
            return ResponseEntity.ok("Mở khóa khách hàng thành công!");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/{id}/force")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> hardDelete(@PathVariable Integer id) {
        try {
            Integer accountId = securityUtils.getCurrentAccountId();
            userService.hardDelete(id, accountId);
            return ResponseEntity.ok("Xóa vĩnh viễn khách hàng!");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}