package com.lvtn.java.dto.account;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AccountRequest {
    private String fullName;
    private String email;
    private String password;
    private String phone;
    private String avatar;
    private String jobTitle;
    private Integer roleId;
    private String status;
}
