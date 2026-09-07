package com.lvtn.java.modules.about.entity;

import com.lvtn.java.domain.AuditableEntity;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Data
@Table(name = "contacts")
public class Contact extends AuditableEntity {
    private String email;
}
