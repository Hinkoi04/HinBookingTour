package com.lvtn.java.modules.user.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.lvtn.java.dto.account.AccountRequest;
import com.lvtn.java.dto.account.AccountResponse;
import com.lvtn.java.security.SecurityUtils;
import com.lvtn.java.modules.user.service.AccountService;
import com.lvtn.java.modules.tour.service.impl.ImageUploadServiceImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/accounts")
@RequiredArgsConstructor
public class AccountController {

    private final AccountService accountService;
    private final ImageUploadServiceImpl imageUploadService;
    private final SecurityUtils securityUtils;
    private final ObjectMapper objectMapper;

    @GetMapping
//    @PreAuthorize("@permissionCheckService.hasPermission(principal.accountId(), 'VIEW_USER')")
    public ResponseEntity<List<AccountResponse>> getAllActive() {
        return ResponseEntity.ok(accountService.findAllActive());
    }

    @GetMapping("/trash")
    @PreAuthorize("@permissionCheckService.hasPermission(principal.accountId(), 'ACCOUNT_TRASH')")
    public ResponseEntity<List<AccountResponse>> getAllTrash() {
        return ResponseEntity.ok(accountService.findAllTrash());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getById(@PathVariable Integer id) {
        try {
            return ResponseEntity.ok(accountService.findById(id));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping
    @PreAuthorize("@permissionCheckService.hasPermission(principal.accountId(), 'CREATE_USER')")
    public ResponseEntity<?> create(@RequestBody AccountRequest request) {
        try {
            Integer creatorId = securityUtils.getCurrentAccountId();
            return ResponseEntity.ok(accountService.create(request, creatorId));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("@permissionCheckService.hasPermission(principal.accountId(), 'UPDATE_USER') or #id == authentication.principal.accountId()")
    public ResponseEntity<?> update(
            @PathVariable Integer id,
            @RequestPart("data") String dataJson,
            @RequestPart(value = "file", required = false) MultipartFile file
    ) {
        try {
            AccountRequest request = objectMapper.readValue(dataJson, AccountRequest.class);
            Integer updaterId = securityUtils.getCurrentAccountId();

            String avatarUrl = (file != null && !file.isEmpty())
                    ? imageUploadService.uploadImage(file)
                    : null;

            return ResponseEntity.ok(accountService.update(id, request, avatarUrl, updaterId));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("@permissionCheckService.hasPermission(principal.accountId(), 'DELETE_USER')")
    public ResponseEntity<?> delete(@PathVariable Integer id) {
        try {
            Integer deleterId = securityUtils.getCurrentAccountId();
            accountService.delete(id, deleterId);
            return ResponseEntity.ok("Đã chuyển tài khoản vào thùng rác thành công!");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/{id}/restore")
    @PreAuthorize("@permissionCheckService.hasPermission(principal.accountId(), 'UPDATE_USER')")
    public ResponseEntity<?> restore(@PathVariable Integer id) {
        try {
            Integer restorerId = securityUtils.getCurrentAccountId();
            accountService.restore(id, restorerId);
            return ResponseEntity.ok("Khôi phục tài khoản thành công!");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/{id}/force")
    @PreAuthorize("@permissionCheckService.hasPermission(principal.accountId(), 'DELETE_USER')")
    public ResponseEntity<?> hardDelete(@PathVariable Integer id) {
        try {
            Integer requesterId = securityUtils.getCurrentAccountId();
            accountService.hardDelete(id, requesterId);
            return ResponseEntity.ok("Đã xóa vĩnh viễn tài khoản!");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}