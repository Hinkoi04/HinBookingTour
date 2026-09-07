package com.lvtn.java.modules.tripDetails.repository;

import com.lvtn.java.modules.tripDetails.entity.Vehicle;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface VehicleRepository extends JpaRepository<Vehicle, Integer> {
    List<Vehicle> findByDeletedFalse();
    List<Vehicle> findByDeletedTrue();
}
