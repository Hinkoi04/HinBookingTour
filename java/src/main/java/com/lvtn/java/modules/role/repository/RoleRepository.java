package com.lvtn.java.modules.role.repository;

import com.lvtn.java.modules.role.entity.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.CrudRepository;

import java.util.List;

public interface RoleRepository extends JpaRepository<Role, Integer> {
    List<Role> findByDeleted(Integer deleted);
}
