package com.lvtn.java.modules.auth.controller;

import com.lvtn.java.dto.auth.*;
import com.lvtn.java.modules.auth.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.Collections;
import java.util.Map;

@RestController
@RequestMapping(value = "/api/admin/auth")
@RequiredArgsConstructor
public class AuthController {
    private final AuthService authService;

    @GetMapping("/check")
    public ResponseEntity<Map<String, String>> check() {
        return ResponseEntity.ok(Collections.singletonMap("status", "ok"));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    @PostMapping("/refresh")
    public ResponseEntity<AuthResponse> refresh(@Valid @RequestBody RefreshTokenRequest request) {
        return ResponseEntity.ok(authService.refresh(request));
    }

    @PostMapping("/change-password")
    public ResponseEntity<String> changePassword(Principal principal, @Valid @RequestBody ChangePasswordRequest request) {
        authService.changePassword(principal.getName(), request);
        return ResponseEntity.ok("Đổi mật khẩu thành công");
    }

    @GetMapping("/me")
    public ResponseEntity<CurrentAccountResponse> me(Principal principal) {
        return ResponseEntity.ok(authService.me(principal.getName()));
    }

    @PostMapping("/logout")
    public ResponseEntity<String> logout(Principal principal) {
        authService.logout(principal.getName());
        return ResponseEntity.ok("Đăng xuất thành công");
    }
}