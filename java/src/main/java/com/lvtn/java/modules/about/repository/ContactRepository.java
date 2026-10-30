package com.lvtn.java.modules.about.repository;

import com.lvtn.java.modules.about.entity.Contact;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ContactRepository extends JpaRepository<Contact, Integer> {
    boolean existsByEmailIgnoreCase(String email);

    List<Contact> findAllByOrderByCreatedAtDesc();
}
