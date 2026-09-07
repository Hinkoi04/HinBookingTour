package com.lvtn.java.modules.about.controller;

import com.lvtn.java.dto.review.ReviewRequest;
import com.lvtn.java.modules.about.service.ReviewService;
import com.lvtn.java.modules.user.entity.User;
import com.lvtn.java.modules.user.entity.Account;
import com.lvtn.java.modules.user.repository.UserRepository;
import com.lvtn.java.modules.user.repository.AccountRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;
    private final UserRepository userRepository;
    private final AccountRepository accountRepository;

    private Integer getCurrentUserId(Principal principal) {
        String email = principal.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy khách hàng với email: " + email));
        return user.getId();
    }

    private Integer getCurrentAccountId(Principal principal) {
        String email = principal.getName();
        Account account = accountRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy tài khoản admin với email: " + email));
        return account.getId();
    }

    @GetMapping
//    @PreAuthorize("@permissionCheckService.hasPermission(principal.accountId(), 'VIEW_REVIEW')")
    public ResponseEntity<?> getAllReviews() {
        return ResponseEntity.ok(reviewService.findAll());
    }

    @GetMapping("/tour/{tourId}")
    public ResponseEntity<?> getApprovedReviewsByTour(@PathVariable Integer tourId) {
        return ResponseEntity.ok(reviewService.findApprovedByTour(tourId));
    }

    @PostMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> createReview(@RequestBody ReviewRequest request, Principal principal) {
        Integer currentUserId = getCurrentUserId(principal);
        return ResponseEntity.ok(reviewService.create(request, currentUserId));
    }

    @PutMapping("/{id}/toggle-visibility")
    @PreAuthorize("@permissionCheckService.hasPermission(principal.accountId(), 'UPDATE_REVIEW')")
    public ResponseEntity<?> toggleVisibility(@PathVariable Integer id, Principal principal) {
        Integer adminId = getCurrentAccountId(principal);
        return ResponseEntity.ok(reviewService.toggleVisibility(id, adminId));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("@permissionCheckService.hasPermission(principal.accountId(), 'DELETE_REVIEW')")
    public ResponseEntity<?> deleteReview(@PathVariable Integer id, Principal principal) {
        Integer adminId = getCurrentAccountId(principal);
        reviewService.delete(id, adminId);
        return ResponseEntity.ok("Deleted successfully");
    }
    @GetMapping("/trash")
    @PreAuthorize("@permissionCheckService.hasPermission(principal.accountId(), 'VIEW_REVIEW')")
    public ResponseEntity<?> getTrashReviews() {
        return ResponseEntity.ok(reviewService.getTrash());
    }

    @PutMapping("/{id}/restore")
    @PreAuthorize("@permissionCheckService.hasPermission(principal.accountId(), 'UPDATE_REVIEW')")
    public ResponseEntity<?> restoreReview(@PathVariable Integer id, Principal principal) {
        Integer adminId = getCurrentAccountId(principal);
        return ResponseEntity.ok(reviewService.restore(id, adminId));
    }

    @DeleteMapping("/{id}/hard")
    @PreAuthorize("@permissionCheckService.hasPermission(principal.accountId(), 'DELETE_REVIEW')")
    public ResponseEntity<?> hardDeleteReview(@PathVariable Integer id) {
        reviewService.hardDelete(id);
        return ResponseEntity.ok("Hard deleted successfully");
    }
}