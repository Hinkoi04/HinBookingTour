package com.lvtn.java.modules.role.entity;

import com.lvtn.java.domain.AuditableEntity;
import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@Table(name = "permissions")
public class Permission {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    private String name;

    @Column(name = "permission_key")
    private String permissionKey;

    @Column(name = "permission_group")
    private String permissionGroup;

    private String description;
}
