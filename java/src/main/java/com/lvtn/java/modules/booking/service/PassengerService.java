package com.lvtn.java.modules.booking.service;

import com.lvtn.java.dto.booking.PassengerResponse;
import com.lvtn.java.dto.booking.PassengerUpdateRequest;

import java.util.List;

public interface PassengerService {
    List<PassengerResponse> findByBookingId(Integer bookingId);
    PassengerResponse findById(Integer id);
    PassengerResponse updatePassenger(Integer id, PassengerUpdateRequest request);
}