package com.lvtn.java.modules.about.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.lvtn.java.dto.blog.BlogRequest;
import com.lvtn.java.dto.blog.BlogResponse;
import com.lvtn.java.modules.about.service.BlogService;
import com.lvtn.java.modules.tour.service.impl.ImageUploadServiceImpl;
import com.lvtn.java.security.SecurityUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping(value = "/api/blogs")
@RequiredArgsConstructor
public class BlogController {

    private final BlogService blogService;
    private final SecurityUtils securityUtils;
    private final ImageUploadServiceImpl imageUploadService;
    private final ObjectMapper objectMapper = new ObjectMapper();

    @GetMapping
    public ResponseEntity<List<BlogResponse>> findAll() {
        return ResponseEntity.ok(blogService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> findById(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(blogService.findById(id));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/trash")
//    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<BlogResponse>> findAllTrash() {
        return ResponseEntity.ok(blogService.findAllTrash());
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
//    @PreAuthorize("hasAnyRole('ADMIN','STAFF')")
    public ResponseEntity<?> create(
            @RequestPart("request") String requestString,
            @RequestPart(value = "image", required = false) MultipartFile image) {
        try {
            Integer creatorId = securityUtils.getCurrentAccountId();
            BlogRequest request = objectMapper.readValue(requestString, BlogRequest.class);

            String imageUrl = request.getThumbnail();

            if (image != null && !image.isEmpty()) {
                imageUrl = imageUploadService.uploadImage(image);
            }

            BlogResponse response = blogService.create(request, imageUrl, creatorId);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
//    @PreAuthorize("hasAnyRole('ADMIN','STAFF')")
    public ResponseEntity<?> update(
            @PathVariable Long id,
            @RequestPart("request") String requestString,
            @RequestPart(value = "image", required = false) MultipartFile image) {
        try {
            Integer updaterId = securityUtils.getCurrentAccountId();
            BlogRequest request = objectMapper.readValue(requestString, BlogRequest.class);

            String imageUrl = request.getThumbnail();
            if (image != null && !image.isEmpty()) {
                imageUrl = imageUploadService.uploadImage(image);
            }

            BlogResponse response = blogService.update(id, request, imageUrl, updaterId);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
//    @PreAuthorize("hasAnyRole('ADMIN','STAFF')")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        try {
            Integer deleterId = securityUtils.getCurrentAccountId();
            blogService.delete(id, deleterId);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/{id}/restore")
//    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> restore(@PathVariable Long id) {
        try {
            Integer restorerId = securityUtils.getCurrentAccountId();
            blogService.restore(id, restorerId);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/{id}/force")
//    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> hardDelete(@PathVariable Long id) {
        try {
            blogService.hardDelete(id);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}