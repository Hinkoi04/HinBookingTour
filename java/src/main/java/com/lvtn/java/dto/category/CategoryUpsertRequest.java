package com.lvtn.java.dto.category;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


@Data
@NoArgsConstructor
@AllArgsConstructor
public class CategoryUpsertRequest {
    private Integer parentId;
    private String title;
    private String slug;
    private String description;
    private String thumbnail;
    private String status = "active";
    private Integer createdBy;
    private Integer updatedBy;
    private Integer deletedBy;
}