package com.lvtn.java.modules.booking.service.impl;

import com.lvtn.java.common.exception.NotFoundException;
import com.lvtn.java.dto.booking.PassengerResponse;
import com.lvtn.java.dto.booking.PassengerUpdateRequest;
import com.lvtn.java.modules.booking.entity.Passenger;
import com.lvtn.java.modules.booking.repository.PassengerRepository;
import com.lvtn.java.modules.booking.service.PassengerService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class PassengerServiceImpl implements PassengerService {

    private final PassengerRepository passengerRepository;

    private PassengerResponse mapToResponse(Passenger p) {
        return new PassengerResponse(
                p.getId(), p.getFullName(), p.getDob(), p.getGender(),
                p.getIdentityCard(), p.getPhone(), p.getPassengerType()
        );
    }

    @Override
    public List<PassengerResponse> findByBookingId(Integer bookingId) {
        return passengerRepository.findByBooking_Id(bookingId).stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    public PassengerResponse findById(Integer id) {
        Passenger passenger = passengerRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Không tìm thấy hành khách với ID: " + id));
        return mapToResponse(passenger);
    }

    @Override
    @Transactional
    public PassengerResponse updatePassenger(Integer id, PassengerUpdateRequest request) {
        Passenger passenger = passengerRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Không tìm thấy hành khách với ID: " + id));

        passenger.setFullName(request.getFullName());
        passenger.setDob(request.getDob());
        passenger.setGender(request.getGender());
        passenger.setIdentityCard(request.getIdentityCard());
        passenger.setPhone(request.getPhone());
        passenger.setPassengerType(request.getPassengerType());

        Passenger saved = passengerRepository.save(passenger);
        return mapToResponse(saved);
    }
}