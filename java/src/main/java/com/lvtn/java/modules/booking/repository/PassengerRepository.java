package com.lvtn.java.modules.booking.repository;

import com.lvtn.java.modules.booking.entity.Passenger;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PassengerRepository extends JpaRepository<Passenger, Integer> {
    List<Passenger> findByBooking_Id(Integer bookingId);
}
