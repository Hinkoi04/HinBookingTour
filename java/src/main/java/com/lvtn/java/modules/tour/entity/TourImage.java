package com.lvtn.java.modules.tour.entity;

import com.lvtn.java.domain.AuditableEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@Table(name = "tour_images")
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TourImage extends AuditableEntity {

    @Column(name = "tour_id")
    private Integer tourId;

    @Column(name = "image_url")
    private String imageUrl;

    private Integer position;

}
