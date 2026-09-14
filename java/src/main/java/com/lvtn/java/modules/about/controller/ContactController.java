package com.lvtn.java.modules.about.controller;

import com.lvtn.java.modules.about.entity.Contact;
import com.lvtn.java.modules.about.service.ContactService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping(value = "/api/contacts")
@RequiredArgsConstructor
public class ContactController {
    private final ContactService contactService;

    @GetMapping
    public List<Contact> findAll() {
        return contactService.findAll();
    }

    @PostMapping
    public ResponseEntity<?> create(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        if (email == null || email.trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Email không được để trống");
        }
        return ResponseEntity.ok(contactService.create(email.trim()));
    }
}
