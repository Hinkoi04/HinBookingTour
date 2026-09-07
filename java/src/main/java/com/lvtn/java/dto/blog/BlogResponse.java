package com.lvtn.java.dto.blog;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class BlogResponse {
    private Long id;
    private String title;
    private String slug;
    private String thumbnail;
    private String description;
    private String content;
    private String status="active";
    private Boolean deleted;
    private LocalDateTime deletedAt;
    private Integer createdBy;
    private Integer updatedBy;
    private Integer deletedBy;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
