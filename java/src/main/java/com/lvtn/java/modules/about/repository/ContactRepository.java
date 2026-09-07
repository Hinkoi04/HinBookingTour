package com.lvtn.java.modules.about.repository;

import com.lvtn.java.modules.about.entity.Contact;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ContactRepository extends JpaRepository<Contact, Long> {
}
