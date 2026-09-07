package com.lvtn.java.dto.tour;

import com.lvtn.java.dto.schedule.ScheduleResponse;
import jakarta.persistence.Column;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TourResponse {
    private Integer id;
    private Integer categoryId;
    private String title;
    private String slug;
    private List<ScheduleResponse> schedules;
    private String description;
    private String time;
    private String thumbnail;
    private String status;
    private List<String> images;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private Integer createdBy;
    private Integer updatedBy;
    private Boolean deleted = false;
    private LocalDateTime deletedAt;
    private Integer deletedBy;
}