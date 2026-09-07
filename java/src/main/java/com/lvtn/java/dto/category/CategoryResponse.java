package com.lvtn.java.dto.category;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CategoryResponse {
    private Integer id;
    private Integer parentId;
    private String title;
    private String slug;
    private String description;
    private String thumbnail;
    private String status;
    private Integer tourCount;
    private Boolean deleted;
    private LocalDateTime deletedAt;
    private Integer createdBy;
    private Integer updatedBy;
    private Integer deletedBy;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
