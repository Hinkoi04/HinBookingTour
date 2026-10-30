package com.lvtn.java.modules.about.service.impl;

import com.lvtn.java.modules.about.entity.Contact;
import com.lvtn.java.modules.about.repository.ContactRepository;
import com.lvtn.java.modules.about.service.ContactService;
import org.springframework.stereotype.Service;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Locale;

@Service
public class ContactServiceImpl implements ContactService {
    private final ContactRepository contactRepository;

    public ContactServiceImpl(ContactRepository contactRepository) {
        this.contactRepository = contactRepository;
    }

    @Override
    public List<Contact> findAll() {
        return contactRepository.findAllByOrderByCreatedAtDesc();
    }

    @Override
    public Contact create(String email) {
        String normalizedEmail = email.trim().toLowerCase(Locale.ROOT);
        if (contactRepository.existsByEmailIgnoreCase(normalizedEmail)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Email này đã đăng ký nhận tin");
        }

        Contact contact = new Contact();
        contact.setEmail(normalizedEmail);
        contact.setDeleted(false);
        return contactRepository.save(contact);
    }
}
