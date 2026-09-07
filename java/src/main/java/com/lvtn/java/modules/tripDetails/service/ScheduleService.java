package com.lvtn.java.modules.tripDetails.service;

import com.lvtn.java.dto.schedule.ScheduleResponse;
import com.lvtn.java.dto.schedule.ScheduleUpsertRequest;

import java.util.List;

public interface ScheduleService {
    List<ScheduleResponse> getSchedulesByTourId(Integer tourId);
    void saveAll(Integer tourId, List<ScheduleUpsertRequest> requests);
}
