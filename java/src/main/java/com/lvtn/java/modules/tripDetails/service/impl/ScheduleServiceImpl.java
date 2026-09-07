package com.lvtn.java.modules.tripDetails.service.impl;

import com.lvtn.java.modules.tripDetails.entity.Schedule;
import com.lvtn.java.modules.tour.entity.Tour;
import com.lvtn.java.dto.schedule.ScheduleResponse;
import com.lvtn.java.dto.schedule.ScheduleUpsertRequest;
import com.lvtn.java.modules.tripDetails.repository.ScheduleRepository;
import com.lvtn.java.modules.tour.repository.TourRepository;
import com.lvtn.java.modules.tripDetails.service.ScheduleService;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ScheduleServiceImpl implements ScheduleService {
    private final ScheduleRepository scheduleRepository;
    private final TourRepository tourRepository;
    private final ModelMapper modelMapper;

    public ScheduleServiceImpl(ScheduleRepository scheduleRepository, TourRepository tourRepository, ModelMapper modelMapper) {
        this.scheduleRepository = scheduleRepository;
        this.tourRepository = tourRepository;
        this.modelMapper = modelMapper;
    }

    @Override
    public List<ScheduleResponse> getSchedulesByTourId(Integer tourId) {
        List<Schedule> schedules = scheduleRepository.findByTourIdAndDeletedFalseOrderByDayNumberAsc(tourId);
        return schedules.stream()
                .map(schedule -> modelMapper.map(schedule, ScheduleResponse.class))
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void saveAll(Integer tourId, List<ScheduleUpsertRequest> requests) {
        Tour tour = tourRepository.findById(tourId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy Tour với ID: " + tourId));
        scheduleRepository.softDeleteByTourId(tourId);
        if (requests == null || requests.isEmpty()) {
            return;
        }

        List<Schedule> newSchedules = requests.stream().map(req -> {
            Schedule schedule = new Schedule();
            schedule.setTour(tour);
            schedule.setDayNumber(req.getDayNumber());
            schedule.setTitle(req.getTitle());
            schedule.setContent(req.getContent());
            schedule.setDeleted(false);
            return schedule;
        }).collect(Collectors.toList());
        scheduleRepository.saveAll(newSchedules);
    }
}
