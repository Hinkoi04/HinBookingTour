package com.lvtn.java.dto.account;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AccountResponse {
    private Integer id;
    private String fullName;
    private String email;
    private String phone;
    private String avatar;
    private String jobTitle;
    private String status;

    private Integer roleId;
    private String roleName;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime deletedAt;

    private Integer createdBy;
    private Integer updatedBy;
    private Integer deletedBy;
}