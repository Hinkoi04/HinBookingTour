package com.lvtn.java.modules.role.service.impl;


import com.lvtn.java.dto.role.RoleRequest;
import com.lvtn.java.modules.role.entity.Permission;
import com.lvtn.java.modules.role.entity.Role;
import com.lvtn.java.modules.role.repository.PermissionRepository;
import com.lvtn.java.modules.role.repository.RoleRepository;
import com.lvtn.java.modules.role.service.RoleService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;

@Service
@RequiredArgsConstructor
public class RoleServiceImpl implements RoleService {

    private final RoleRepository roleRepository;
    private final PermissionRepository permissionRepository;

    @Override
    public List<Role> getAllRoles() {
        return roleRepository.findAll();
    }

    @Override
    public Role getRoleById(Integer id) {
        return roleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy vai trò với ID: " + id));
    }

    @Override
    @Transactional
    public Role createRole(RoleRequest request) {
        Role role = new Role();
        role.setName(request.getName());
        role.setDescription(request.getDescription());
        role.setCreatedAt(LocalDateTime.now());
        role.setUpdatedAt(LocalDateTime.now());
        role.setDeleted(0);
        return roleRepository.save(role);
    }

    @Override
    @Transactional
    public Role updateRole(Integer id, RoleRequest request) {
        Role existingRole = getRoleById(id);
        existingRole.setName(request.getName());
        existingRole.setDescription(request.getDescription());
        existingRole.setUpdatedAt(LocalDateTime.now());
        return roleRepository.save(existingRole);
    }

    @Override
    @Transactional
    public void deleteRole(Integer id) {
        Role existingRole = getRoleById(id);
        existingRole.setDeleted(1);
        existingRole.setDeletedAt(LocalDateTime.now());
        roleRepository.save(existingRole);
    }
    @Override
    @Transactional
    public void restoreRole(Integer id) {
        Role role = roleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy vai trò với ID: " + id));

        role.setDeleted(0);

        roleRepository.save(role);
    }

    @Override
    @Transactional
    public void updatePermissions(Integer roleId, List<Long> permissionIds) {
        Role role = getRoleById(roleId);
        List<Permission> permissions = permissionRepository.findAllById(permissionIds);
        role.setPermissions(new HashSet<>(permissions));
        roleRepository.save(role);
    }
}