package com.lvtn.java.modules.tripDetails.repository;

import com.lvtn.java.modules.tripDetails.entity.Departure;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

public interface DepartureRepository extends JpaRepository<Departure, Integer> {

    @Query(value = "SELECT COUNT(*) FROM departures WHERE tour_id = :tourId AND deleted = 0", nativeQuery = true)
    int countDeparturesByTourId(@Param("tourId") Integer tourId);

    @Transactional
    @Modifying
    @Query(value = "DELETE FROM departures WHERE tour_id = :tourId", nativeQuery = true)
    void hardDeleteDeparturesByTourId(@Param("tourId") Integer tourId);

    @Query("SELECT d FROM Departure d WHERE d.deleted = false")
    List<Departure> findAllActive();

    @Query("SELECT d FROM Departure d WHERE d.deleted = true")
    List<Departure> findAllTrash();

    @Query(value = "SELECT * FROM departures " +
            "WHERE guide_id = :guideId " +
            "AND deleted = 0 " +
            "AND (:excludeId IS NULL OR id <> :excludeId) " +
            "AND start_date <= :endDate " +
            "AND end_date >= :startDate",
            nativeQuery = true)
    List<Departure> findConflictingByGuide(@Param("guideId") Integer guideId,
                                           @Param("startDate") LocalDateTime startDate,
                                           @Param("endDate") LocalDateTime endDate,
                                           @Param("excludeId") Integer excludeId);
}