package com.lvtn.java.modules.about.repository;

import com.lvtn.java.modules.about.entity.Blog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BlogRepository extends JpaRepository<Blog,Long> {
    @Query("SELECT b FROM Blog b WHERE b.deleted = false OR b.deleted IS NULL ORDER BY b.createdAt DESC")
    List<Blog> findAllActive();

    @Query("SELECT b FROM Blog b WHERE b.deleted = true ORDER BY b.deletedAt DESC")
    List<Blog> findAllTrash();
}
