package com.lvtn.java.modules.tour.repository;

import com.lvtn.java.modules.tour.entity.TourImage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public interface TourImageRepository extends JpaRepository<TourImage, Integer> {
    List<TourImage> findByTourIdAndDeletedFalse(Integer tourId);

    @Transactional
    @Modifying
    @Query("UPDATE TourImage ti SET ti.deleted = true, ti.deletedBy = :deleterId WHERE ti.tourId = :tourId")
    void softDeleteByTourId(Integer tourId, Integer deleterId);
}
