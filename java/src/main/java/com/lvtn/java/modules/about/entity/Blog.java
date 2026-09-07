package com.lvtn.java.modules.about.entity;

import com.lvtn.java.domain.AuditableEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Data
@Table(name = "blogs")
public class Blog extends AuditableEntity {
    private String title;
    private String slug;
    private String thumbnail;
    private String description;
    @Column(columnDefinition = "TEXT")
    private String content;
    private String status="active";

}
