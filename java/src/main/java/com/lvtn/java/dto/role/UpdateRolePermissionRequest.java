package com.lvtn.java.dto.role;

import lombok.Data;

import java.util.List;

@Data
public class UpdateRolePermissionRequest {
    private List<Long> permissionIds;
}
