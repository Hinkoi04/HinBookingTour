package com.lvtn.java.modules.tripDetails.service.impl;

import com.lvtn.java.modules.tripDetails.entity.Vehicle;
import com.lvtn.java.dto.vehicle.VehicleResponse;
import com.lvtn.java.dto.vehicle.VehicleUpsertRequest;
import com.lvtn.java.modules.tripDetails.repository.VehicleRepository;
import com.lvtn.java.modules.tripDetails.service.VehicleService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class VehicleServiceImpl implements VehicleService {
    private final VehicleRepository vehicleRepository;
    private final ModelMapper mapper;

    private VehicleResponse mapToResponse(Vehicle vehicle) {
        return mapper.map(vehicle, VehicleResponse.class);
    }

    @Override
    public List<VehicleResponse> findAllActive() {
        return vehicleRepository.findByDeletedFalse().stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    public VehicleResponse findById(Integer id) {
        Vehicle vehicle = vehicleRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy phương tiện với ID: " + id));
        return mapToResponse(vehicle);
    }

    @Override
    @Transactional
    public VehicleResponse create(VehicleUpsertRequest request, Integer creatorId) {
        Vehicle vehicle = mapper.map(request, Vehicle.class);

        vehicle.setCreatedBy(creatorId);
        vehicle.setUpdatedBy(creatorId);

        return mapToResponse(vehicleRepository.save(vehicle));
    }

    @Override
    @Transactional
    public VehicleResponse update(Integer id, VehicleUpsertRequest request, Integer updaterId) {
        Vehicle existing = vehicleRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy phương tiện với ID: " + id));

        mapper.map(request, existing);
        existing.setUpdatedBy(updaterId);

        return mapToResponse(vehicleRepository.save(existing));
    }

    @Override
    @Transactional
    public void delete(Integer id, Integer deleterId) {
        Vehicle vehicle = vehicleRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy phương tiện với ID: " + id));

        vehicle.setDeleted(true);
        vehicle.setDeletedAt(LocalDateTime.now());
        vehicle.setDeletedBy(deleterId);
        vehicleRepository.save(vehicle);
    }
    @Override
    public List<VehicleResponse> findDeleted() {
        return vehicleRepository.findByDeletedTrue().stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    @Transactional
    public VehicleResponse restore(Integer id, Integer updaterId) {
        Vehicle vehicle = vehicleRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy phương tiện với ID: " + id));
        vehicle.setDeleted(false);
        vehicle.setDeletedAt(null);
        vehicle.setUpdatedBy(updaterId);
        return mapToResponse(vehicleRepository.save(vehicle));
    }

    @Override
    @Transactional
    public void hardDelete(Integer id) {
        if (!vehicleRepository.existsById(id)) {
            throw new EntityNotFoundException("Không tìm thấy phương tiện với ID: " + id);
        }
        vehicleRepository.deleteById(id);
    }
}
