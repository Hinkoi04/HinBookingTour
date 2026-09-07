package com.lvtn.java.modules.tripDetails.controller;

import com.lvtn.java.dto.vehicle.VehicleResponse;
import com.lvtn.java.dto.vehicle.VehicleUpsertRequest;
import com.lvtn.java.security.SecurityUtils;
import com.lvtn.java.modules.tripDetails.service.VehicleService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/vehicle")
@RequiredArgsConstructor
public class VehicleController {
    private final VehicleService vehicleService;
    private final SecurityUtils securityUtils;

    @GetMapping
    public ResponseEntity<List<VehicleResponse>> getAllActive() {
        return ResponseEntity.ok(vehicleService.findAllActive());
    }

    @GetMapping("/{id}")
    public ResponseEntity<VehicleResponse> getById(@PathVariable Integer id) {
        return ResponseEntity.ok(vehicleService.findById(id));
    }

    @PostMapping
    public ResponseEntity<VehicleResponse> create(@RequestBody VehicleUpsertRequest request) {
        Integer creatorId = securityUtils.getCurrentAccountId();
        return ResponseEntity.ok(vehicleService.create(request, creatorId));
    }

    @PutMapping("/{id}")
    public ResponseEntity<VehicleResponse> update(@PathVariable Integer id, @RequestBody VehicleUpsertRequest request) {
        Integer updaterId = securityUtils.getCurrentAccountId();
        return ResponseEntity.ok(vehicleService.update(id, request, updaterId));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        Integer deleterId = securityUtils.getCurrentAccountId();
        vehicleService.delete(id, deleterId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/trash")
    public ResponseEntity<List<VehicleResponse>> getTrash() {
        return ResponseEntity.ok(vehicleService.findDeleted());
    }

    @PutMapping("/{id}/restore")
    public ResponseEntity<VehicleResponse> restore(@PathVariable Integer id) {
        Integer updaterId = securityUtils.getCurrentAccountId();
        return ResponseEntity.ok(vehicleService.restore(id, updaterId));
    }

    @DeleteMapping("/{id}/force")
    public ResponseEntity<Void> hardDelete(@PathVariable Integer id) {
        vehicleService.hardDelete(id);
        return ResponseEntity.noContent().build();
    }
}