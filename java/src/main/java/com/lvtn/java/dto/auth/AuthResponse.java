package com.lvtn.java.dto.auth;

import java.time.Instant;

public record AuthResponse(
        String accessToken,
        String refreshToken,
        String tokenType,
        Instant expiresAt,
        Instant refreshExpiresAt,
        CurrentAccountResponse user
) {
}
