package com.lvtn.java.modules.tripDetails.service.impl;

import com.lvtn.java.modules.booking.repository.BookingRepository;
import com.lvtn.java.modules.tour.entity.Tour;
import com.lvtn.java.modules.tour.repository.TourRepository;
import com.lvtn.java.modules.tripDetails.entity.Departure;
import com.lvtn.java.modules.tripDetails.repository.DepartureRepository;
import com.lvtn.java.modules.tripDetails.repository.VehicleRepository;
import com.lvtn.java.modules.user.repository.AccountRepository;
import org.junit.jupiter.api.Test;
import org.modelmapper.ModelMapper;
import org.modelmapper.convention.MatchingStrategies;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.time.temporal.TemporalAdjusters;
import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.mockito.ArgumentMatchers.anyList;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

class DepartureServiceImplTest {
    @Test
    void createsEndOfMonthDeparturesUsingNearestPricesAndDefaults() {
        DepartureRepository departureRepository = mock(DepartureRepository.class);
        TourRepository tourRepository = mock(TourRepository.class);
        Tour tourWithSchedule = createTour(1, "3 ngày");
        Tour tourWithoutSchedule = createTour(2, "2 ngày");
        Tour tourAlreadyScheduled = createTour(3, "1 ngày");

        LocalDateTime targetDate = LocalDate.now(ZoneId.of("Asia/Ho_Chi_Minh"))
                .with(TemporalAdjusters.lastDayOfMonth())
                .atTime(8, 0);
        Departure fartherSchedule = createDeparture(
                tourWithSchedule, targetDate.minusDays(20), BigDecimal.valueOf(8_000_000), 20);
        Departure nearestSchedule = createDeparture(
                tourWithSchedule, targetDate.plusDays(2), BigDecimal.valueOf(9_000_000), 12);
        Departure sameDaySchedule = createDeparture(
                tourAlreadyScheduled, targetDate, BigDecimal.valueOf(6_000_000), 5);

        when(tourRepository.findAllActiveTours())
                .thenReturn(List.of(tourWithSchedule, tourWithoutSchedule, tourAlreadyScheduled));
        when(departureRepository.findAllActive())
                .thenReturn(List.of(fartherSchedule, nearestSchedule, sameDaySchedule));
        when(departureRepository.saveAll(anyList())).thenAnswer(invocation -> invocation.getArgument(0));

        ModelMapper modelMapper = new ModelMapper();
        modelMapper.getConfiguration().setMatchingStrategy(MatchingStrategies.STRICT);
        DepartureServiceImpl service = new DepartureServiceImpl(
                departureRepository,
                tourRepository,
                mock(VehicleRepository.class),
                mock(AccountRepository.class),
                mock(BookingRepository.class),
                modelMapper);

        Map<String, Object> result = service.createEndOfMonthDepartures(42);

        assertEquals(2, result.get("created"));
        assertEquals(1, result.get("skipped"));
        assertEquals(targetDate.format(DateTimeFormatter.ofPattern("dd/MM/yyyy")), result.get("date"));

        var savedDeparturesCaptor = org.mockito.ArgumentCaptor.forClass(List.class);
        verify(departureRepository).saveAll(savedDeparturesCaptor.capture());
        @SuppressWarnings("unchecked")
        List<Departure> savedDepartures = savedDeparturesCaptor.getValue();

        Departure copied = savedDepartures.stream()
                .filter(departure -> departure.getTourId().getId().equals(tourWithSchedule.getId()))
                .findFirst()
                .orElseThrow();
        assertEquals(targetDate, copied.getStartTime());
        assertEquals(targetDate.plusDays(2).withHour(23).withMinute(59), copied.getEndDate());
        assertEquals("TPHCM", copied.getDepartureFrom());
        assertEquals(nearestSchedule.getPriceAdult(), copied.getPriceAdult());
        assertEquals(nearestSchedule.getStockAdult(), copied.getStockAdult());
        assertNull(copied.getVehicle());
        assertNull(copied.getGuide());
        assertNull(copied.getDiscount());
        assertEquals(42, copied.getCreatedBy());

        Departure defaults = savedDepartures.stream()
                .filter(departure -> departure.getTourId().getId().equals(tourWithoutSchedule.getId()))
                .findFirst()
                .orElseThrow();
        assertEquals(BigDecimal.valueOf(10_000_000), defaults.getPriceAdult());
        assertEquals(BigDecimal.valueOf(7_000_000), defaults.getPriceChildren());
        assertEquals(BigDecimal.valueOf(5_000_000), defaults.getPriceBaby());
        assertEquals(0, defaults.getStockAdult());
        assertEquals(0, defaults.getStockChildren());
        assertEquals(0, defaults.getStockBaby());
    }

    private Tour createTour(Integer id, String duration) {
        Tour tour = new Tour();
        tour.setId(id);
        tour.setTime(duration);
        return tour;
    }

    private Departure createDeparture(Tour tour, LocalDateTime startTime, BigDecimal adultPrice, int adultStock) {
        Departure departure = new Departure();
        departure.setTourId(tour);
        departure.setStartTime(startTime);
        departure.setPriceAdult(adultPrice);
        departure.setPriceChildren(BigDecimal.valueOf(6_000_000));
        departure.setPriceBaby(BigDecimal.valueOf(4_000_000));
        departure.setStockAdult(adultStock);
        departure.setStockChildren(8);
        departure.setStockBaby(3);
        return departure;
    }
}
