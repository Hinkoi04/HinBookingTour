package com.lvtn.java.domain;

import jakarta.persistence.Column;
import jakarta.persistence.MappedSuperclass;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@MappedSuperclass
@Setter
@Getter
public class AuditableEntity extends BaseEntity{

    @Column(columnDefinition = "boolean default false")
    private Boolean deleted = false;

    @Column(name = "deleted_at",nullable = true)
    private LocalDateTime deletedAt;

    @Column(name = "created_by",nullable = true)
    private Integer createdBy;

    @Column(name = "updated_by",nullable = true)
    private Integer updatedBy;

    @Column(name = "deleted_by",nullable = true)
    private Integer deletedBy;

    @CreationTimestamp
    @Column(name = "created_at",nullable = false,updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at",nullable = false)
    private LocalDateTime updatedAt;

}
