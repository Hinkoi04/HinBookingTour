package com.lvtn.java.modules.tour.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.lvtn.java.domain.AuditableEntity;
import com.lvtn.java.modules.tripDetails.entity.Departure;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction;

import java.util.List;

@Entity
@Table(name = "tours")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@SQLDelete(sql = "UPDATE tours SET deleted = true, deletedAt = CURRENT_TIMESTAMP WHERE id=?")
@SQLRestriction("deleted = false")
public class Tour extends AuditableEntity {

    @Column(name = "category_id", nullable = false)
    private Integer categoryId;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false, unique = true)
    private String slug;

    @Column(columnDefinition = "TEXT")
    private String description;

    @OneToMany(mappedBy = "tourId")
    @JsonIgnore
    private List<Departure> departures;

    @Column(length = 100, nullable = false)
    private String time;

    @Column(length = 500, nullable = false)
    private String thumbnail;

    @Column(length = 50)
    private String status = "active";
}