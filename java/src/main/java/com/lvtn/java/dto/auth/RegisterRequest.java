package com.lvtn.java.dto.auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record RegisterRequest(
        @NotBlank(message = "Họ và tên không được để trống")
        @Size(max = 255, message = "Họ và tên không được vượt quá 255 ký tự")
        String fullName,
        @NotBlank(message = "Email không được để trống")
        @Email(message = "Email không hợp lệ")
        @Size(max = 255, message = "Email không được vượt quá 255 ký tự")
        String email,
        @Size(max = 20, message = "Số điện thoại không được vượt quá 20 ký tự")
        String phone,
        @NotBlank(message = "Mật khẩu không được để trống")
        @Size(min = 6, max = 72, message = "Mật khẩu phải có từ 6 đến 72 ký tự")
        String password
) {
}
