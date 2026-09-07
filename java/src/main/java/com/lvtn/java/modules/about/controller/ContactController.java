package com.lvtn.java.modules.about.controller;

import com.lvtn.java.common.ApiResponse;
import com.lvtn.java.modules.about.entity.Contact;
import com.lvtn.java.modules.about.service.ContactService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(value = "api/contacts")
@RequiredArgsConstructor
public class ContactController {
    private final ContactService contactService;

    @GetMapping
    public List<Contact> findAll() {
        return contactService.findAll();
    }
}
