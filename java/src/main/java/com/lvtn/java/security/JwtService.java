package com.lvtn.java.security;

import com.lvtn.java.config.AppJwtProperties;
import com.lvtn.java.modules.user.entity.Account;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jws;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.Collections;
import java.util.Date;
import java.util.List;
import java.util.UUID;

@Service
public class JwtService {
    public static final String TOKEN_TYPE_CLAIM = "tokenType";
    public static final String ACCESS_TOKEN_TYPE = "access";
    public static final String REFRESH_TOKEN_TYPE = "refresh";

    private final AppJwtProperties properties;
    private final SecretKey secretKey;

    public JwtService(AppJwtProperties properties) {
        this.properties = properties;
        this.secretKey = Keys.hmacShaKeyFor(properties.secret().getBytes(StandardCharsets.UTF_8));
    }

    public String generateAccessToken(Account account, Instant now, Instant expiresAt) {
        if (account.getRole() == null) {
            throw new RuntimeException("Tài khoản của bạn chưa được phân quyền. Vui lòng liên hệ Admin!");
        }
        String roleName = account.getRole().getName();
        return Jwts.builder()
                .issuer(properties.issuer())
                .subject(account.getEmail())
                .issuedAt(Date.from(now))
                .expiration(Date.from(expiresAt))
                .claim(TOKEN_TYPE_CLAIM, ACCESS_TOKEN_TYPE)
                .claim("roles", List.of(roleName))
                .claim("accountId", account.getId())
                .claim("fullName", account.getFullName())
                .signWith(secretKey)
                .compact();
    }
    public List<String> extractAuthorities(String token) {
        Claims claims = parseClaims(token);
        Object authoritiesObject = claims.get("authorities");
        if (authoritiesObject instanceof List<?> authList) {
            return authList.stream().map(String::valueOf).toList();
        }
        return Collections.emptyList();
    }

    public String generateRefreshToken(Account account, String jti, Instant now, Instant expiresAt) {
        return Jwts.builder()
                .issuer(properties.issuer())
                .subject(account.getEmail())
                .id(jti)
                .issuedAt(Date.from(now))
                .expiration(Date.from(expiresAt))
                .claim(TOKEN_TYPE_CLAIM, REFRESH_TOKEN_TYPE)
                .claim("accountId", account.getId())
                .signWith(secretKey)
                .compact();
    }

    public Claims parseClaims(String token) {
        return parser(token).getPayload();
    }

    public String extractUsername(String token) {
        return parseClaims(token).getSubject();
    }

    public Integer extractAccountId(String token) {
        Object accountId = parseClaims(token).get("accountId");
        if (accountId instanceof Integer i) return i;
        if (accountId instanceof Number n) return n.intValue();
        return null;
    }

    public List<String> extractRoles(String token) {
        Claims claims = parseClaims(token);
        Object rolesObject = claims.get("roles");
        if (rolesObject instanceof List<?> rolesList) {
            return rolesList.stream().map(String::valueOf).toList();
        }
        return Collections.emptyList();
    }

    public boolean isRefreshToken(String token) {
        return REFRESH_TOKEN_TYPE.equals(parseClaims(token).get(TOKEN_TYPE_CLAIM, String.class));
    }

    public boolean isAccessToken(String token) {
        return ACCESS_TOKEN_TYPE.equals(parseClaims(token).get(TOKEN_TYPE_CLAIM, String.class));
    }

    public String extractJti(String token) {
        return parseClaims(token).getId();
    }

    public Instant extractExpiration(String token) {
        Date expiration = parseClaims(token).getExpiration();
        return expiration != null ? expiration.toInstant() : null;
    }

    public String generateJti() {
        return UUID.randomUUID().toString();
    }

    private Jws<Claims> parser(String token) {
        return Jwts.parser()
                .verifyWith(secretKey)
                .requireIssuer(properties.issuer())
                .build()
                .parseSignedClaims(token);
    }
}