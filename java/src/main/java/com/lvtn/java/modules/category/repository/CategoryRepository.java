package com.lvtn.java.modules.category.repository;

import com.lvtn.java.modules.category.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CategoryRepository extends JpaRepository<Category, Integer> {
    List<Category> findByTitleContainingIgnoreCaseAndDeletedFalse(String keyword);
    List<Category>findByDeletedFalse();
    List<Category> findByDeletedTrue();

}
