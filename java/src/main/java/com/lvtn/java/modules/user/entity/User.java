package com.lvtn.java.modules.user.entity;

import com.lvtn.java.domain.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "users")
public class User extends BaseEntity {

    @Column(name = "full_name")
    private String fullName;

    private String email;

    private String phone;

    private String password;

    private String status="active";

    @Column(columnDefinition = "boolean default false")
    private Boolean deleted = false;

    @Column(name = "deleted_at",nullable = true)
    private LocalDateTime deletedAt;

    @Column(name = "deleted_by",nullable = true)
    private Integer deletedBy;

    @CreationTimestamp
    @Column(name = "created_at",nullable = false,updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at",nullable = false)
    private LocalDateTime updatedAt;

}
