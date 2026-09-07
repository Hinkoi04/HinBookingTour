package com.lvtn.java.dto.user;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserRequest {
    private String fullName;
    private String email;
    private String phone;
    private String password;
    private String status;
}
