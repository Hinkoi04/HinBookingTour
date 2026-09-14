package com.lvtn.java.modules.about.service.impl;

import com.lvtn.java.modules.about.entity.Contact;
import com.lvtn.java.modules.about.repository.ContactRepository;
import com.lvtn.java.modules.about.service.ContactService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ContactServiceImpl implements ContactService {
    private final ContactRepository contactRepository;

    public ContactServiceImpl(ContactRepository contactRepository) {
        this.contactRepository = contactRepository;
    }

    @Override
    public List<Contact> findAll() {
        return contactRepository.findAll();
    }

    @Override
    public Contact create(String email) {
        Contact contact = new Contact();
        contact.setEmail(email);
        contact.setDeleted(false);
        return contactRepository.save(contact);
    }
}
