package com.lvtn.java.modules.role.repository;

import com.lvtn.java.modules.role.entity.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.CrudRepository;

import java.util.List;
import java.util.Optional;

public interface RoleRepository extends JpaRepository<Role, Integer> {
    List<Role> findByDeleted(Integer deleted);
    Optional<Role> findByNameIgnoreCaseAndDeleted(String name, Integer deleted);
}
