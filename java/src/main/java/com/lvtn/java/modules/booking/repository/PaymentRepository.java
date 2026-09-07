package com.lvtn.java.modules.booking.repository;

import com.lvtn.java.modules.booking.entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PaymentRepository extends JpaRepository<Payment, Integer> {
}
