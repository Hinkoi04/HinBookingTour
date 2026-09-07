package com.lvtn.java.modules.tripDetails.controller;

import com.lvtn.java.dto.departure.DepartureResponse;
import com.lvtn.java.dto.departure.DepartureUpsertRequest;
import com.lvtn.java.security.SecurityUtils;
import com.lvtn.java.modules.tripDetails.service.DepartureService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/departure")
public class DepartureController {
    private final DepartureService departureService;
    private final SecurityUtils securityUtils;

    public DepartureController(DepartureService departureService, SecurityUtils securityUtils) {
        this.departureService = departureService;
        this.securityUtils = securityUtils;
    }

    @GetMapping
    public ResponseEntity<List<DepartureResponse>> getAll() {
        return ResponseEntity.ok(departureService.findAll());
    }

    @GetMapping("/guides")
    public ResponseEntity<?> getAvailableGuides(
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate,
            @RequestParam(required = false) Integer excludeDepartureId) {
        return ResponseEntity.ok(departureService.getAvailableGuides(startDate, endDate, excludeDepartureId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<DepartureResponse> getById(@PathVariable Integer id) {
        return ResponseEntity.ok(departureService.findById(id));
    }

    @GetMapping("/trash")
    @PreAuthorize("@permissionCheckService.hasPermission(principal.accountId(), 'OPERATIONS_TRASH')")
    public ResponseEntity<List<DepartureResponse>> getAllTrash() {
        return ResponseEntity.ok(departureService.findAllTrash());
    }

    @PostMapping
    @PreAuthorize("@permissionCheckService.hasPermission(principal.accountId(), 'CREATE_OPERATIONS')")
    public ResponseEntity<?> create(@RequestBody DepartureUpsertRequest request) {
        try {
            Integer creatorId = securityUtils.getCurrentAccountId();
            return ResponseEntity.ok(departureService.create(request, creatorId));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/{id}")
    @PreAuthorize("@permissionCheckService.hasPermission(principal.accountId(), 'UPDATE_OPERATIONS')")
    public ResponseEntity<DepartureResponse> update(@PathVariable Integer id, @RequestBody DepartureUpsertRequest request) {
        Integer updaterId = securityUtils.getCurrentAccountId();
        return ResponseEntity.ok(departureService.update(id, request, updaterId));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("@permissionCheckService.hasPermission(principal.accountId(), 'DELETE_OPERATIONS')")
    public ResponseEntity<?> delete(@PathVariable Integer id) {
        Integer userId = securityUtils.getCurrentAccountId();
        departureService.delete(id, userId);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/{id}/restore")
    @PreAuthorize("@permissionCheckService.hasPermission(principal.accountId(), 'OPERATIONS_TRASH')")
    public ResponseEntity<Void> restore(@PathVariable Integer id) {
        Integer restorerId = securityUtils.getCurrentAccountId();
        departureService.restore(id, restorerId);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{id}/force")
    @PreAuthorize("@permissionCheckService.hasPermission(principal.accountId(), 'OPERATIONS_TRASH')")
    public ResponseEntity<Void> hardDelete(@PathVariable Integer id) {
        departureService.hardDelete(id);
        return ResponseEntity.ok().build();
    }
}