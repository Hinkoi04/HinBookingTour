package com.lvtn.java.dto.auth;

import java.util.List;

public record CurrentAccountResponse(
        Integer id,
        String email,
        String fullName,
        String role,
        String avatar,
        String jobTitle,
        List<String> permissions) {
}
