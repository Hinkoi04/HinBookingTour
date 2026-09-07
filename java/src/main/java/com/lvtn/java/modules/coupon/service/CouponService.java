package com.lvtn.java.modules.coupon.service;

import com.lvtn.java.dto.coupon.CouponRequest;
import com.lvtn.java.dto.coupon.CouponResponse;
import java.util.List;

public interface CouponService {
    List<CouponResponse> findAllActive();
    List<CouponResponse> findDeleted();
    CouponResponse findById(Integer id);
    CouponResponse create(CouponRequest request, Integer creatorId);
    CouponResponse update(Integer id, CouponRequest request, Integer updaterId);
    void delete(Integer id, Integer deleterId);
    CouponResponse restore(Integer id, Integer restorerId);
    void hardDelete(Integer id);
}