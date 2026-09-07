package com.lvtn.java.modules.role.service.impl;

import com.lvtn.java.modules.role.entity.Permission;
import com.lvtn.java.modules.role.repository.PermissionRepository;
import com.lvtn.java.modules.role.service.PermissionService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PermissionServiceImpl implements PermissionService {
    private final PermissionRepository permissionRepository;

    public List<Permission> getAllPermissions() {
        return permissionRepository.findAll();
    }
}
