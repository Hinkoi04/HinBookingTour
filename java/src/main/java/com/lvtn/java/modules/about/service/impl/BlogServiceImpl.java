package com.lvtn.java.modules.about.service.impl;

import com.lvtn.java.dto.blog.BlogRequest;
import com.lvtn.java.dto.blog.BlogResponse;
import com.lvtn.java.modules.about.entity.Blog;
import com.lvtn.java.modules.about.repository.BlogRepository;
import com.lvtn.java.modules.about.service.BlogService;
import jakarta.persistence.EntityNotFoundException;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.text.Normalizer;
import java.time.LocalDateTime;
import java.util.List;
import java.util.regex.Pattern;

@Service
@Transactional
public class BlogServiceImpl implements BlogService {
    private final BlogRepository blogRepository;
    private final ModelMapper mapper;

    public BlogServiceImpl(BlogRepository blogRepository, ModelMapper mapper) {
        this.blogRepository = blogRepository;
        this.mapper = mapper;
    }

    private String generateSlug(String title) {
        if (title == null || title.isEmpty()) return "";
        String normalized = Normalizer.normalize(title, Normalizer.Form.NFD);
        Pattern pattern = Pattern.compile("\\p{InCombiningDiacriticalMarks}+");
        String slug = pattern.matcher(normalized).replaceAll("");
        return slug.toLowerCase()
                .replace("đ", "d")
                .replaceAll("[^a-z0-9]+", "-")
                .replaceAll("^-|-$", "");
    }

    public BlogResponse mapToResponse(Blog blog) {
        return mapper.map(blog, BlogResponse.class);
    }

    @Override
    public List<BlogResponse> findAll() {
        return blogRepository.findAllActive().stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    public BlogResponse findById(Long id) {
        Blog blog = blogRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy Blog với ID: " + id));
        return mapToResponse(blog);
    }

    @Override
    public BlogResponse create(BlogRequest request, String imageUrl, Integer creatorId) {
        Blog blog = mapper.map(request, Blog.class);

        blog.setSlug(generateSlug(blog.getTitle()));

        if (imageUrl != null && !imageUrl.isBlank()) {
            blog.setThumbnail(imageUrl);
        }

        blog.setCreatedBy(creatorId);
        blog.setUpdatedBy(creatorId);
        blog.setCreatedAt(LocalDateTime.now());
        blog.setUpdatedAt(LocalDateTime.now());

        return mapToResponse(blogRepository.save(blog));
    }

    @Override
    public BlogResponse update(Long id, BlogRequest request, String imageUrl, Integer updaterId) {
        Blog existing = blogRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy Blog với ID: " + id));
        mapper.typeMap(BlogRequest.class, Blog.class)
                .addMappings(m -> {
                    m.skip(Blog::setCreatedBy);
                    m.skip(Blog::setUpdatedBy);
                    m.skip(Blog::setDeletedBy);
                });

        mapper.map(request, existing);

        existing.setSlug(generateSlug(existing.getTitle()));

        if (imageUrl != null && !imageUrl.isBlank()) {
            existing.setThumbnail(imageUrl);
        }

        existing.setUpdatedBy(updaterId);
        existing.setUpdatedAt(LocalDateTime.now());

        return mapToResponse(blogRepository.save(existing));
    }

    @Override
    public void delete(Long id, Integer deleterId) {
        Blog existing = blogRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy Blog với ID: " + id));

        existing.setDeleted(true);
        existing.setDeletedAt(LocalDateTime.now());
        if (deleterId != null) {
            existing.setDeletedBy(deleterId);
        }

        blogRepository.save(existing);
    }

    @Override
    public List<BlogResponse> findAllTrash() {
        return blogRepository.findAllTrash().stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    public void restore(Long id, Integer restorerId) {
        Blog existing = blogRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy Blog với ID: " + id));

        existing.setDeleted(false);
        existing.setDeletedAt(null);
        existing.setDeletedBy(null);
        existing.setUpdatedBy(restorerId);
        existing.setUpdatedAt(LocalDateTime.now());

        blogRepository.save(existing);
    }

    @Override
    public void hardDelete(Long id) {
        Blog existing = blogRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy Blog với ID: " + id));

        blogRepository.delete(existing);
    }
}