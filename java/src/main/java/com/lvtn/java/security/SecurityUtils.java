package com.lvtn.java.security;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

@Component
public class SecurityUtils {

    public Integer getCurrentAccountId() {
        AuthPrincipal principal = getPrincipal();
        if (principal.accountId() == null) {
            throw new RuntimeException("Token không chứa thông tin tài khoản hợp lệ!");
        }
        return principal.accountId();
    }

    public String getCurrentEmail() {
        return getPrincipal().email();
    }

    private AuthPrincipal getPrincipal() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated() || !(auth.getPrincipal() instanceof AuthPrincipal principal)) {
            throw new RuntimeException("Chưa đăng nhập hoặc token không hợp lệ!");
        }
        return principal;
    }
}