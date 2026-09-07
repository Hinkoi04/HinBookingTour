package com.lvtn.java.modules.coupon.repository;

import com.lvtn.java.modules.coupon.entity.Coupon;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface CouponRepository extends JpaRepository<Coupon, Integer> {
    List<Coupon> findAllByDeletedFalseOrderByIdDesc();
    List<Coupon> findAllByDeletedTrueOrderByIdDesc();
    Optional<Coupon> findByIdAndDeletedFalse(Integer id);
    boolean existsByCodeAndDeletedFalse(String code);
}