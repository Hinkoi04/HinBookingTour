package com.lvtn.java.modules.category.service.impl;

import java.text.Normalizer;
import java.time.LocalDateTime;
import java.util.List;
import java.util.regex.Pattern;

import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.lvtn.java.modules.category.entity.Category;
import com.lvtn.java.dto.category.CategoryResponse;
import com.lvtn.java.dto.category.CategoryUpsertRequest;
import com.lvtn.java.modules.category.repository.CategoryRepository;
import com.lvtn.java.modules.tour.repository.TourRepository;
import com.lvtn.java.modules.category.service.CategoryService;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CategoryServiceImpl implements CategoryService {
    private final CategoryRepository categoryRepository;
    private final ModelMapper mapper;
    private final TourRepository tourRepository;

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

    private CategoryResponse mapToResponse(Category category) {
        CategoryResponse response = mapper.map(category, CategoryResponse.class);
        int count = tourRepository.countByCategoryIdAndDeletedFalse(category.getId());
        response.setTourCount(count);
        if (category.getParent() != null) {
            response.setParentId(category.getParent().getId());
        }
        return response;
    }

    @Override
    public List<CategoryResponse> findAll() {
        return categoryRepository.findAll().stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    public CategoryResponse findById(Integer id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy danh mục với ID: " + id));
        return mapToResponse(category);
    }

    @Override
    @Transactional
    public CategoryResponse create(CategoryUpsertRequest request, Integer creatorId) {
        mapper.typeMap(CategoryUpsertRequest.class, Category.class)
                .addMappings(m -> m.skip(Category::setParent));

        Category category = mapper.map(request, Category.class);
        category.setSlug(generateSlug(request.getTitle()));

        if (request.getParentId() != null) {
            Category parent = categoryRepository.findById(request.getParentId())
                    .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy danh mục cha với ID: " + request.getParentId()));
            category.setParent(parent);
        }
        category.setCreatedBy(creatorId);
        category.setUpdatedBy(creatorId);

        return mapToResponse(categoryRepository.save(category));
    }

    @Override
    @Transactional
    public CategoryResponse update(Integer id, CategoryUpsertRequest request, Integer updaterId) {
        Category existingCategory = categoryRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy danh mục với ID: " + id));

        existingCategory.setTitle(request.getTitle());
        existingCategory.setSlug(generateSlug(request.getTitle()));
        existingCategory.setDescription(request.getDescription());
        existingCategory.setThumbnail(request.getThumbnail());
        existingCategory.setStatus(request.getStatus());

        if (request.getParentId() != null) {
            Category parent = categoryRepository.findById(request.getParentId())
                    .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy danh mục cha với ID: " + request.getParentId()));
            existingCategory.setParent(parent);
        } else {
            existingCategory.setParent(null);
        }
        existingCategory.setUpdatedBy(updaterId);

        return mapToResponse(categoryRepository.save(existingCategory));
    }

    @Override
    @Transactional
    public void delete(Integer id, Integer deleterId) {
        Category existingCategory = categoryRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy danh mục với ID: " + id));
        int tourCount = tourRepository.countByCategoryIdAndDeletedFalse(id);
        if (tourCount > 0) {
            throw new RuntimeException("Không thể chuyển vào thùng rác! Danh mục này đang chứa " + tourCount + " tour hoạt động.");
        }
        existingCategory.setDeleted(true);
        existingCategory.setDeletedAt(LocalDateTime.now());
        existingCategory.setDeletedBy(deleterId);

        categoryRepository.save(existingCategory);
    }

    @Override
    public List<CategoryResponse> findAllActive() {
        return categoryRepository.findByDeletedFalse().stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    public List<CategoryResponse> findAllTrash() {
        return categoryRepository.findByDeletedTrue().stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    @Transactional
    public void restore(Integer id, Integer restorerId) {
        Category existingCategory = categoryRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy danh mục với ID: " + id));

        existingCategory.setDeleted(false);
        existingCategory.setDeletedAt(null);
        existingCategory.setDeletedBy(null);
        existingCategory.setUpdatedBy(restorerId);

        categoryRepository.save(existingCategory);
    }

    @Override
    @Transactional
    public void hardDelete(Integer id) {
        Category existingCategory = categoryRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy danh mục với ID: " + id));
        categoryRepository.delete(existingCategory);
    }
}