package com.lvtn.java.modules.tripDetails.service.impl;

import com.lvtn.java.modules.tripDetails.entity.Departure;
import com.lvtn.java.modules.tour.entity.Tour;
import com.lvtn.java.modules.tripDetails.entity.Vehicle;
import com.lvtn.java.dto.departure.DepartureResponse;
import com.lvtn.java.dto.departure.DepartureUpsertRequest;
import com.lvtn.java.modules.tripDetails.repository.DepartureRepository;
import com.lvtn.java.modules.tour.repository.TourRepository;
import com.lvtn.java.modules.tripDetails.repository.VehicleRepository;
import com.lvtn.java.modules.tripDetails.service.DepartureService;
import com.lvtn.java.modules.user.entity.Account;
import com.lvtn.java.modules.user.repository.AccountRepository;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;



import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.HashMap;
import java.util.stream.Collectors;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
@Transactional
public class DepartureServiceImpl implements DepartureService {
    private final DepartureRepository departureRepository;
    private final TourRepository tourRepository;
    private final VehicleRepository vehicleRepository;
    private final AccountRepository accountRepository;
    private final ModelMapper mapper;

    public DepartureServiceImpl(DepartureRepository departureRepository,
                                TourRepository tourRepository,
                                VehicleRepository vehicleRepository,
                                AccountRepository accountRepository,
                                ModelMapper mapper) {
        this.departureRepository = departureRepository;
        this.tourRepository = tourRepository;
        this.vehicleRepository = vehicleRepository;
        this.accountRepository = accountRepository;
        this.mapper = mapper;

        this.mapper.typeMap(Departure.class, DepartureResponse.class)
                .addMappings(m -> m.skip(DepartureResponse::setTourId))
                .addMappings(m -> m.skip(DepartureResponse::setVehicleId))
                .addMappings(m -> m.skip(DepartureResponse::setGuideId));

        this.mapper.typeMap(DepartureUpsertRequest.class, Departure.class)
                .addMappings(m -> m.skip(Departure::setTourId))
                .addMappings(m -> m.skip(Departure::setVehicle))
                .addMappings(m -> m.skip(Departure::setGuide))
                .addMappings(m -> m.skip(Departure::setUpdatedBy));
    }

    private DepartureResponse mapToResponse(Departure departure) {
        DepartureResponse response = mapper.map(departure, DepartureResponse.class);

        if (departure.getTourId() != null) {
            response.setTourId(departure.getTourId().getId());
            response.setTourTitle(departure.getTourId().getTitle());
        }
        if (departure.getVehicle() != null) {
            response.setVehicleId(departure.getVehicle().getId());
            response.setVehicleName(departure.getVehicle().getName());
            response.setVehicleType(departure.getVehicle().getVehicleType());
        }

        if (departure.getGuide() != null) {
            response.setGuideId(departure.getGuide().getId());
            response.setGuideName(departure.getGuide().getFullName());
        }

        return response;
    }

    @Override
    public List<DepartureResponse> findAll() {
        return departureRepository.findAllActive().stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    public DepartureResponse findById(Integer id) {
        Departure departure = departureRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy Lịch khởi hành với ID: " + id));
        return mapToResponse(departure);
    }

    @Override
    public List<Map<String, Object>> getAvailableGuides(String startDate, String endDate, Integer excludeDepartureId) {
        List<Account> guideAccounts = accountRepository.findAll().stream()
                .filter(acc -> acc.getRole() != null &&
                        "Guide".equalsIgnoreCase(acc.getRole().getName()) &&
                        "active".equalsIgnoreCase(acc.getStatus()) &&
                        !Boolean.TRUE.equals(acc.getDeleted()))
                .collect(Collectors.toList());

        LocalDateTime start = parseDateTime(startDate);
        LocalDateTime end = parseDateTime(endDate);

        return guideAccounts.stream()
                .map(acc -> {
                    Map<String, Object> map = new HashMap<>();
                    map.put("id", acc.getId());
                    map.put("fullName", acc.getFullName());

                    boolean available = true;
                    if (start != null && end != null) {
                        List<Departure> conflicts = departureRepository.findConflictingByGuide(
                                acc.getId(), start, end, excludeDepartureId);
                        available = conflicts.isEmpty();
                    }
                    map.put("available", available);
                    return map;
                })
                .collect(Collectors.toList());
    }

    private LocalDateTime parseDateTime(String value) {
        if (value == null || value.isBlank()) {
            return null;
        }
        try {
            return LocalDateTime.parse(value);
        } catch (Exception e) {
            return null;
        }
    }

    private LocalDateTime calculateEndDate(LocalDateTime startTime, String tourTime) {
        if (startTime == null || tourTime == null || tourTime.isBlank()) {
            return startTime;
        }
        int days = 1;
        Pattern pattern = Pattern.compile("(\\d+)\\s*(n|ng[aà]y)", Pattern.CASE_INSENSITIVE);
        Matcher matcher = pattern.matcher(tourTime);
        if (matcher.find()) {
            try {
                days = Math.max(Integer.parseInt(matcher.group(1)), 1);
            } catch (NumberFormatException e) {
                days = 1;
            }
        }
        return startTime.plusDays(days - 1).withHour(23).withMinute(59).withSecond(0).withNano(0);
    }

    @Override
    public DepartureResponse create(DepartureUpsertRequest request, Integer creatorId) {
        Departure departure = mapper.map(request, Departure.class);

        Tour tour = tourRepository.findById(request.getTourId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy Tour với ID: " + request.getTourId()));
        departure.setTourId(tour);

        if (departure.getEndDate() == null && departure.getStartTime() != null) {
            departure.setEndDate(calculateEndDate(departure.getStartTime(), tour.getTime()));
        } else if (request.getEndDate() != null) {
            departure.setEndDate(request.getEndDate());
        }

        if (request.getVehicleId() != null) {
            Vehicle vehicle = vehicleRepository.findById(request.getVehicleId())
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy Phương tiện với ID: " + request.getVehicleId()));
            departure.setVehicle(vehicle);
        }

        if (request.getGuideId() != null) {
            Account guide = accountRepository.findById(request.getGuideId())
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy Hướng dẫn viên với ID: " + request.getGuideId()));
            departure.setGuide(guide);
        }

        departure.setCreatedBy(creatorId);
        departure.setUpdatedBy(creatorId);

        Departure savedDeparture = departureRepository.save(departure);
        return mapToResponse(savedDeparture);
    }

    @Override
    public DepartureResponse update(Integer id, DepartureUpsertRequest request, Integer updaterId) {
        Departure existing = departureRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy Lịch khởi hành với ID: " + id));
                
        Integer createdBy = existing.getCreatedBy();
        java.time.LocalDateTime createdAt = existing.getCreatedAt();
        
        mapper.map(request, existing);
        
        existing.setCreatedBy(createdBy);
        existing.setCreatedAt(createdAt);
        existing.setUpdatedBy(updaterId);
        existing.setUpdatedAt(LocalDateTime.now());

        if (request.getTourId() != null) {
            Tour tour = tourRepository.findById(request.getTourId())
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy Tour với ID: " + request.getTourId()));
            existing.setTourId(tour);
        }
        
        if (request.getEndDate() == null && existing.getStartTime() != null && existing.getTourId() != null) {
            existing.setEndDate(calculateEndDate(existing.getStartTime(), existing.getTourId().getTime()));
        } else if (request.getEndDate() != null) {
            existing.setEndDate(request.getEndDate());
        }

        if (request.getVehicleId() != null) {
            Vehicle vehicle = vehicleRepository.findById(request.getVehicleId())
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy Phương tiện với ID: " + request.getVehicleId()));
            existing.setVehicle(vehicle);
        } else {
            existing.setVehicle(null);
        }

        if (request.getGuideId() != null) {
            Account guide = accountRepository.findById(request.getGuideId())
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy Hướng dẫn viên với ID: " + request.getGuideId()));
            existing.setGuide(guide);
        } else {
            existing.setGuide(null);
        }

        Departure updated = departureRepository.save(existing);
        return mapToResponse(updated);
    }

    @Override
    public void delete(Integer id, Integer userId) {
        Departure existing = departureRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy Lịch khởi hành với ID: " + id));
        existing.setDeleted(true);
        existing.setDeletedAt(LocalDateTime.now());
        if (userId != null) {
            existing.setDeletedBy(userId);
        }
        departureRepository.save(existing);
    }

    @Override
    public List<DepartureResponse> findAllTrash() {
        return departureRepository.findAllTrash().stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    public void restore(Integer id, Integer restorerId) {
        Departure existing = departureRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy Lịch khởi hành với ID: " + id));

        existing.setDeleted(false);
        existing.setDeletedAt(null);
        existing.setDeletedBy(null);
        existing.setUpdatedBy(restorerId);

        departureRepository.save(existing);
    }

    @Override
    public void hardDelete(Integer id) {
        Departure existing = departureRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy Lịch khởi hành với ID: " + id));

        departureRepository.delete(existing);
    }
}