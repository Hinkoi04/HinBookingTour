package com.lvtn.java.modules.role.repository;

import com.lvtn.java.modules.role.entity.Permission;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PermissionRepository extends JpaRepository<Permission, Long> {
    Optional<Permission> findByPermissionKey(String permissionKey);
}
