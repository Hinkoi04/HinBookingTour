package com.lvtn.java.modules.coupon.service.impl;

import com.lvtn.java.modules.coupon.entity.Coupon;
import com.lvtn.java.dto.coupon.CouponRequest;
import com.lvtn.java.dto.coupon.CouponResponse;
import com.lvtn.java.modules.coupon.repository.CouponRepository;
import com.lvtn.java.modules.coupon.service.CouponService;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@Transactional
public class CouponServiceImpl implements CouponService {

    private final CouponRepository couponRepository;
    private final ModelMapper mapper;

    public CouponServiceImpl(CouponRepository couponRepository, ModelMapper mapper) {
        this.couponRepository = couponRepository;
        this.mapper = mapper;

        this.mapper.typeMap(CouponRequest.class, Coupon.class)
                .addMappings(m -> m.skip(Coupon::setId))
                .addMappings(m -> m.skip(Coupon::setUsedCount))
                .addMappings(m -> m.skip(Coupon::setDeleted))
                .addMappings(m -> m.skip(Coupon::setCreatedBy))
                .addMappings(m -> m.skip(Coupon::setUpdatedBy))
                .addMappings(m -> m.skip(Coupon::setDeletedBy))
                .addMappings(m -> m.skip(Coupon::setDeletedAt));
    }

    private CouponResponse mapToResponse(Coupon coupon) {
        return mapper.map(coupon, CouponResponse.class);
    }

    @Override
    public List<CouponResponse> findAllActive() {
        return couponRepository.findAllByDeletedFalseOrderByIdDesc().stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    public CouponResponse findById(Integer id) {
        Coupon coupon = couponRepository.findByIdAndDeletedFalse(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy Mã giảm giá với ID: " + id));
        return mapToResponse(coupon);
    }

    @Override
    public CouponResponse create(CouponRequest request, Integer creatorId) {
        if (couponRepository.existsByCodeAndDeletedFalse(request.getCode())) {
            throw new RuntimeException("Mã giảm giá '" + request.getCode() + "' đã tồn tại!");
        }

        Coupon coupon = mapper.map(request, Coupon.class);
        coupon.setUsedCount(0);
        coupon.setDeleted(false);
        coupon.setCreatedBy(creatorId);
        coupon.setUpdatedBy(creatorId);

        Coupon savedCoupon = couponRepository.save(coupon);
        return mapToResponse(savedCoupon);
    }

    @Override
    public CouponResponse update(Integer id, CouponRequest request, Integer updaterId) {
        Coupon existing = couponRepository.findByIdAndDeletedFalse(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy Mã giảm giá với ID: " + id));

        if (!existing.getCode().equals(request.getCode()) &&
                couponRepository.existsByCodeAndDeletedFalse(request.getCode())) {
            throw new RuntimeException("Mã giảm giá '" + request.getCode() + "' đã tồn tại!");
        }
        mapper.map(request, existing);

        existing.setUpdatedBy(updaterId);
        Coupon updatedCoupon = couponRepository.save(existing);
        return mapToResponse(updatedCoupon);
    }

    @Override
    public void delete(Integer id, Integer deleterId) {
        Coupon existing = couponRepository.findByIdAndDeletedFalse(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy Mã giảm giá với ID: " + id));

        existing.setDeleted(true);
        existing.setDeletedAt(LocalDateTime.now());
        if (deleterId != null) {
            existing.setDeletedBy(deleterId);
        }

        couponRepository.save(existing);
    }

    @Override
    public List<CouponResponse> findDeleted() {
        return couponRepository.findAllByDeletedTrueOrderByIdDesc().stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    public CouponResponse restore(Integer id, Integer restorerId) {
        Coupon existing = couponRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy Mã giảm giá với ID: " + id));

        existing.setDeleted(false);
        existing.setDeletedAt(null);
        existing.setDeletedBy(null);
        existing.setUpdatedBy(restorerId);

        Coupon restoredCoupon = couponRepository.save(existing);
        return mapToResponse(restoredCoupon);
    }

    @Override
    public void hardDelete(Integer id) {
        Coupon existing = couponRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy Mã giảm giá với ID: " + id));

        couponRepository.delete(existing);
    }
}