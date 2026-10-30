package com.lvtn.java.modules.booking.service;

import com.lvtn.java.dto.booking.BookingHistoryResponse;
import com.lvtn.java.dto.booking.BookingResponse;

import java.util.List;

public interface BookingService {
    List<BookingResponse> findAllActive();
    List<BookingHistoryResponse> findHistoryByEmail(String email);
    BookingResponse findById(Integer id);
    BookingResponse updateStatus(Integer id, String newStatus , Integer updaterId);
}