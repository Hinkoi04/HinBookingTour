package com.lvtn.java.dto.schedule;

import lombok.Data;

@Data
public class ScheduleUpsertRequest {
    private Integer tourId;
    private int dayNumber;
    private String title;
    private String content;
}
