package com.lvtn.java.modules.about.service;

import com.lvtn.java.dto.blog.BlogRequest;
import com.lvtn.java.dto.blog.BlogResponse;
import com.lvtn.java.modules.about.entity.Blog;

import java.util.List;

public interface BlogService {
    BlogResponse mapToResponse(Blog blog);
    List<BlogResponse> findAll();
    BlogResponse findById(Long id);
    BlogResponse create(BlogRequest request, String imageUrl, Integer creatorId);
    BlogResponse update(Long id, BlogRequest request, String imageUrl, Integer updaterId);

    void delete(Long id, Integer deleterId);
    List<BlogResponse> findAllTrash();
    void restore(Long id, Integer restorerId);
    void hardDelete(Long id);
}
