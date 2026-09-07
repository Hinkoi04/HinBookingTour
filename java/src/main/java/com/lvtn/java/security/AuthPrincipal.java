package com.lvtn.java.security;

import org.springframework.security.core.AuthenticatedPrincipal;

public record AuthPrincipal(Integer accountId, String email) implements AuthenticatedPrincipal {
    @Override
    public String getName() {
        return email;
    }
}