package com.lvtn.java.modules.tripDetails.service.impl;

import com.lvtn.java.dto.departure.DepartureManifestResponse;
import com.lvtn.java.dto.departure.DeparturePassengerDto;
import com.lvtn.java.dto.departure.DepartureResponse;
import com.lvtn.java.dto.departure.DepartureUpsertRequest;
import com.lvtn.java.modules.booking.entity.Booking;
import com.lvtn.java.modules.booking.entity.Passenger;
import com.lvtn.java.modules.booking.repository.BookingRepository;
import com.lvtn.java.modules.tripDetails.entity.Departure;
import com.lvtn.java.modules.tour.entity.Tour;
import com.lvtn.java.modules.tripDetails.entity.Vehicle;
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
import java.util.ArrayList;
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
    private final BookingRepository bookingRepository;
    private final ModelMapper mapper;

    public DepartureServiceImpl(DepartureRepository departureRepository,
                                TourRepository tourRepository,
                                VehicleRepository vehicleRepository,
                                AccountRepository accountRepository,
                                BookingRepository bookingRepository,
                                ModelMapper mapper) {
        this.departureRepository = departureRepository;
        this.tourRepository = tourRepository;
        this.vehicleRepository = vehicleRepository;
        this.accountRepository = accountRepository;
        this.bookingRepository = bookingRepository;
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
            response.setGuidePhone(departure.getGuide().getPhone());
            response.setGuideEmail(departure.getGuide().getEmail());
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
        Departure departure = departureRepository.findByIdWithDetails(id)
                .orElseGet(() -> departureRepository.findById(id)
                        .orElseThrow(() -> new RuntimeException("Không tìm thấy Lịch khởi hành với ID: " + id)));
        return mapToResponse(departure);
    }

    @Override
    public DepartureManifestResponse getDepartureManifest(Integer departureId) {
        Departure departure = departureRepository.findByIdWithDetails(departureId)
                .orElseGet(() -> departureRepository.findById(departureId)
                        .orElseThrow(() -> new RuntimeException("Không tìm thấy Lịch khởi hành với ID: " + departureId)));

        DepartureResponse departureResponse = mapToResponse(departure);

        List<Booking> bookings = bookingRepository.findByDepartureIdWithDetails(departureId);

        List<DeparturePassengerDto> passengerList = new ArrayList<>();
        int totalAdults = 0;
        int totalChildren = 0;
        int totalBabies = 0;
        int confirmedCount = 0;

        if (bookings != null) {
            for (Booking b : bookings) {
                if (b == null) continue;

                if (!"confirmed".equalsIgnoreCase(b.getStatus()) && !"completed".equalsIgnoreCase(b.getStatus())) {
                    continue;
                }

                confirmedCount++;

                List<Passenger> passengers = b.getPassengers();
                if (passengers != null && !passengers.isEmpty()) {
                    for (Passenger p : passengers) {
                        if (p == null) continue;
                        String pType = p.getPassengerType() != null ? p.getPassengerType().toLowerCase() : "adult";
                        if ("adult".equals(pType)) totalAdults++;
                        else if ("child".equals(pType) || "children".equals(pType)) totalChildren++;
                        else if ("baby".equals(pType)) totalBabies++;
                        else totalAdults++;

                        passengerList.add(DeparturePassengerDto.builder()
                                .id(p.getId())
                                .bookingId(b.getId())
                                .bookingCode(b.getBookingCode())
                                .fullName(p.getFullName() != null && !p.getFullName().isBlank() ? p.getFullName() : b.getFullName())
                                .dob(p.getDob())
                                .gender(p.getGender())
                                .identityCard(p.getIdentityCard())
                                .phone(p.getPhone() != null && !p.getPhone().isBlank() ? p.getPhone() : b.getPhone())
                                .passengerType(pType)
                                .bookerName(b.getFullName())
                                .bookerPhone(b.getPhone())
                                .bookerEmail(b.getEmail())
                                .bookingStatus(b.getStatus())
                                .note(b.getNote())
                                .bookingDate(b.getCreatedAt())
                                .build());
                    }
                } else {
                    int qAdult = b.getQuantityAdult() != null ? b.getQuantityAdult() : 1;
                    int qChild = b.getQuantityChildren() != null ? b.getQuantityChildren() : 0;
                    int qBaby = b.getQuantityBaby() != null ? b.getQuantityBaby() : 0;

                    totalAdults += qAdult;
                    totalChildren += qChild;
                    totalBabies += qBaby;

                    passengerList.add(DeparturePassengerDto.builder()
                            .id(null)
                            .bookingId(b.getId())
                            .bookingCode(b.getBookingCode())
                            .fullName(b.getFullName())
                            .dob(null)
                            .gender(null)
                            .identityCard(null)
                            .phone(b.getPhone())
                            .passengerType("adult")
                            .bookerName(b.getFullName())
                            .bookerPhone(b.getPhone())
                            .bookerEmail(b.getEmail())
                            .bookingStatus(b.getStatus())
                            .note(b.getNote())
                            .bookingDate(b.getCreatedAt())
                            .build());
                }
            }
        }

        int totalPassengers = passengerList.size();

        return DepartureManifestResponse.builder()
                .departure(departureResponse)
                .passengers(passengerList)
                .totalPassengers(totalPassengers)
                .totalAdults(totalAdults)
                .totalChildren(totalChildren)
                .totalBabies(totalBabies)
                .totalBookings(bookings != null ? bookings.size() : 0)
                .confirmedBookings(confirmedCount)
                .build();
    }

    @Override
    public List<Map<String, Object>> getAvailableGuides(String startDate, String endDate, Integer excludeDepartureId) {
        List<Account> guideAccounts = accountRepository.findByDeletedFalse().stream()
                .filter(acc -> acc.getRole() != null &&
                        "Guide".equalsIgnoreCase(acc.getRole().getName()) &&
                        "active".equalsIgnoreCase(acc.getStatus()))
                .collect(Collectors.toList());

        LocalDateTime start = parseDateTime(startDate);
        LocalDateTime end = parseDateTime(endDate);

        java.util.Set<Integer> conflictingGuideIds = new java.util.HashSet<>();
        if (start != null && end != null && !guideAccounts.isEmpty()) {
            List<Integer> guideIds = guideAccounts.stream().map(Account::getId).toList();
            List<Departure> conflicts = departureRepository.findConflictingByGuideIds(
                    guideIds, start, end, excludeDepartureId);
            for (Departure d : conflicts) {
                if (d.getGuide() != null) {
                    conflictingGuideIds.add(d.getGuide().getId());
                }
            }
        }

        return guideAccounts.stream()
                .map(acc -> {
                    Map<String, Object> map = new HashMap<>();
                    map.put("id", acc.getId());
                    map.put("fullName", acc.getFullName());
                    boolean available = (start == null || end == null) || !conflictingGuideIds.contains(acc.getId());
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

    @Override
    public Map<String, Object> applyFlashSale(Integer updaterId) {
        LocalDateTime now = LocalDateTime.now();
        List<Departure> upcomingDepartures = departureRepository.findAllActive().stream()
                .filter(d -> d.getStartTime() != null && d.getStartTime().isAfter(now))
                .collect(Collectors.toList());

        int updated = 0;
        for (Departure d : upcomingDepartures) {
            long daysUntil = java.time.Duration.between(now, d.getStartTime()).toDays();
            int discountPercent;
            if (daysUntil < 3) {
                discountPercent = 70;
            } else if (daysUntil < 7) {
                discountPercent = 55;
            } else if (daysUntil < 15) {
                discountPercent = 45;
            } else if (daysUntil < 30) {
                discountPercent = 30;
            } else {
                continue; // no flash sale for departures >= 30 days away
            }
            d.setDiscount(discountPercent);
            d.setUpdatedBy(updaterId);
            d.setUpdatedAt(now);
            departureRepository.save(d);
            updated++;
        }

        Map<String, Object> result = new HashMap<>();
        result.put("updated", updated);
        result.put("message", "Đã áp dụng Flash Sale cho " + updated + " lịch khởi hành sắp tới");
        return result;
    }
}