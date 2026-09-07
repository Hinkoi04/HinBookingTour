package com.lvtn.java.dto.schedule;

import lombok.Data;

@Data
public class ScheduleResponse {
    private Integer id;
    private int dayNumber;
    private String title;
    private String content;
}
