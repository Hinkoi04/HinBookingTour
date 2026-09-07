package com.lvtn.java.modules.role.service;

import com.lvtn.java.dto.role.RoleRequest;
import com.lvtn.java.modules.role.entity.Role;

import java.util.List;

public interface RoleService {
    List<Role> getAllRoles();
    Role getRoleById(Integer id);
    Role createRole(RoleRequest request);
    Role updateRole(Integer id, RoleRequest request);
    void deleteRole(Integer id);
    void restoreRole(Integer id);
    void updatePermissions(Integer roleId, List<Long> permissionIds);
}
