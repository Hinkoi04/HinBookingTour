package com.lvtn.java.modules.tripDetails.controller;

import com.lvtn.java.dto.schedule.ScheduleResponse;
import com.lvtn.java.dto.schedule.ScheduleUpsertRequest;
import com.lvtn.java.modules.tripDetails.service.ScheduleService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/schedules")
public class ScheduleController {

    private final ScheduleService scheduleService;

    public ScheduleController(ScheduleService scheduleService) {
        this.scheduleService = scheduleService;
    }

    @GetMapping("/tour/{tourId}")
    public ResponseEntity<List<ScheduleResponse>> getByTour(@PathVariable Integer tourId) {
        return ResponseEntity.ok(scheduleService.getSchedulesByTourId(tourId));
    }

    @PostMapping("/tour/{tourId}")
//    @PreAuthorize("hasAnyRole('ADMIN','STAFF')")
    public ResponseEntity<?> saveSchedules(@PathVariable Integer tourId, @RequestBody List<ScheduleUpsertRequest> requests) {
        try {
            scheduleService.saveAll(tourId, requests);
            return ResponseEntity.ok("Đã cập nhật lộ trình thành công!");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}