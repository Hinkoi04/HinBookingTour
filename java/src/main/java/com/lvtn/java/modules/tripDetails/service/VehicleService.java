package com.lvtn.java.modules.tripDetails.service;

import com.lvtn.java.dto.vehicle.VehicleResponse;
import com.lvtn.java.dto.vehicle.VehicleUpsertRequest;

import java.util.List;

public interface VehicleService {
    List<VehicleResponse> findAllActive();
    VehicleResponse findById(Integer id);
    VehicleResponse create(VehicleUpsertRequest request, Integer creatorId);
    VehicleResponse update(Integer id, VehicleUpsertRequest request, Integer updaterId);
    void delete(Integer id, Integer deleterId);
    List<VehicleResponse> findDeleted();
    VehicleResponse restore(Integer id, Integer updaterId);
    void hardDelete(Integer id);
}
