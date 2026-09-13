package com.lvtn.java.modules.category.repository;

import com.lvtn.java.modules.category.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

import org.springframework.data.jpa.repository.Query;

public interface CategoryRepository extends JpaRepository<Category, Integer> {
    List<Category> findByTitleContainingIgnoreCaseAndDeletedFalse(String keyword);

    @Query("SELECT c FROM Category c LEFT JOIN FETCH c.parent WHERE c.deleted = false")
    List<Category> findByDeletedFalse();

    @Query("SELECT c FROM Category c LEFT JOIN FETCH c.parent WHERE c.deleted = true")
    List<Category> findByDeletedTrue();

    @Query("SELECT c FROM Category c LEFT JOIN FETCH c.parent")
    List<Category> findAllWithParent();
}
