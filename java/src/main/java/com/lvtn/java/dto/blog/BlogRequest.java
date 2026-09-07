package com.lvtn.java.dto.blog;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class BlogRequest {
    private String title;
    private String slug;
    private String thumbnail;
    private String description;
    private String content;
    private String status="active";

    private Integer createdBy;
    private Integer updatedBy;
    private Integer deletedBy;

}
