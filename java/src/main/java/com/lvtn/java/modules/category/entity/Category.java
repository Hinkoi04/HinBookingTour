package com.lvtn.java.modules.category.entity;

import com.lvtn.java.domain.AuditableEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "categories")
@Getter
@Setter
public class Category extends AuditableEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "parent_id")
    private Category parent;

    private String title;
    private String slug;
    private String description;
    private String thumbnail;
    private String status="active";

}
