package com.lvtn.java.modules.tour.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.lvtn.java.modules.tour.entity.Tour;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public interface TourRepository extends JpaRepository<Tour, Integer> {
    boolean existsBySlug(String slug);

    @Query(value = "SELECT EXISTS(SELECT 1 FROM tours WHERE slug = :slug)", nativeQuery = true)
    boolean existsBySlugIncludingDeleted(@Param("slug") String slug);

    int countByCategoryIdAndDeletedFalse(Integer categoryId);
    boolean existsByCategoryIdAndDeletedFalse(Integer categoryId);

    @Query(value = "SELECT * FROM tours WHERE deleted = 0", nativeQuery = true)
    List<Tour> findAllActiveTours();

    @Query(value = "SELECT * FROM tours WHERE deleted = 1", nativeQuery = true)
    List<Tour> findAllTrashTours();

    @Transactional
    @Modifying
    @Query(value = "UPDATE tours SET deleted = 0, deleted_at = NULL, deleted_by = NULL, updated_by = :updaterId WHERE id = :id", nativeQuery = true)
    void restoreTourNative(@Param("id") Integer id, @Param("updaterId") Integer updaterId);

    @Transactional
    @Modifying
    @Query(value = "DELETE FROM tours WHERE id = :id", nativeQuery = true)
    void hardDeleteTourNative(@Param("id") Integer id);


    long countByDeletedFalse();
    @Query("SELECT COUNT(DISTINCT t.categoryId) FROM Tour t WHERE t.deleted = false")
    int countDistinctCategories();
}