package com.lvtn.java.modules.auth.service.impl;

import com.lvtn.java.config.AppJwtProperties;
import com.lvtn.java.modules.user.entity.Account;
import com.lvtn.java.dto.auth.*;
import com.lvtn.java.modules.user.repository.AccountRepository;
import com.lvtn.java.security.JwtService;
import com.lvtn.java.modules.auth.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {
    private final AccountRepository accountRepository;
    private final JwtService jwtService;
    private final AppJwtProperties jwtProperties;
    private final PasswordEncoder passwordEncoder;

    @Transactional
    public AuthResponse login(LoginRequest request) {
        Account account = accountRepository.findByEmail(request.email())
                .orElseThrow(() -> new BadCredentialsException("Email hoặc mật khẩu không đúng"));

        if (!"active".equalsIgnoreCase(account.getStatus())) {
            throw new BadCredentialsException("Tài khoản đã bị khóa");
        }

        if (!passwordEncoder.matches(request.password(), account.getPassword())) {
            throw new BadCredentialsException("Email hoặc mật khẩu không đúng");
        }

        return generateAndSaveTokens(account);
    }

    @Transactional
    public AuthResponse refresh(RefreshTokenRequest request) {
        String incomingRefreshToken = request.refreshToken();

        if (!jwtService.isRefreshToken(incomingRefreshToken)) {
            throw new BadCredentialsException("Token không hợp lệ");
        }

        String email = jwtService.extractUsername(incomingRefreshToken);

        Account account = accountRepository.findByEmail(email)
                .orElseThrow(() -> new BadCredentialsException("Token không hợp lệ"));

        if (!"active".equalsIgnoreCase(account.getStatus())) {
            throw new BadCredentialsException("Tài khoản đã bị khóa");
        }

        if (account.getToken() == null || !account.getToken().equals(incomingRefreshToken)) {
            throw new BadCredentialsException("Phiên đăng nhập đã hết hạn hoặc đăng nhập từ nơi khác");
        }

        return generateAndSaveTokens(account);
    }

    @Transactional
    public void changePassword(String email, ChangePasswordRequest request) {
        Account account = accountRepository.findByEmail(email).orElseThrow();

        if (!passwordEncoder.matches(request.currentPassword(), account.getPassword())) {
            throw new RuntimeException("Mật khẩu hiện tại không đúng");
        }

        account.setPassword(passwordEncoder.encode(request.newPassword()));
        account.setToken(null);
        accountRepository.save(account);
    }

    @Transactional(readOnly = true)
    public CurrentAccountResponse me(String email) {
        Account account = accountRepository.findByEmail(email).orElseThrow();
        return toCurrentUserResponse(account);
    }

    @Transactional
    public void logout(String email) {
        Account account = accountRepository.findByEmail(email).orElseThrow();
        account.setToken(null);
        accountRepository.save(account);
    }

    private AuthResponse generateAndSaveTokens(Account account) {
        Instant now = Instant.now();
        Instant accessExpiresAt = now.plusSeconds(jwtProperties.accessTokenTtlMinutes() * 60);
        Instant refreshExpiresAt = now.plusSeconds(jwtProperties.refreshTokenTtlDays() * 24 * 60 * 60);

        String jti = jwtService.generateJti();

        String accessToken = jwtService.generateAccessToken(account, now, accessExpiresAt);
        String refreshToken = jwtService.generateRefreshToken(account, jti, now, refreshExpiresAt);

        account.setToken(refreshToken);
        accountRepository.save(account);

        return new AuthResponse(accessToken, refreshToken, "Bearer", accessExpiresAt, refreshExpiresAt, toCurrentUserResponse(account));
    }

    private CurrentAccountResponse toCurrentUserResponse(Account account) {
        String roleName = account.getRole() != null ? account.getRole().getName() : "STAFF";

        List<String> permissions = List.of();
        if (account.getRole() != null && account.getRole().getPermissions() != null) {
            permissions = account.getRole().getPermissions().stream()
                    .map(p -> p.getPermissionKey())
                    .toList();
        }

        return new CurrentAccountResponse(
                account.getId(),
                account.getEmail(),
                account.getFullName(),
                roleName,
                account.getAvatar(),
                account.getJobTitle(),
                permissions
        );
    }
}