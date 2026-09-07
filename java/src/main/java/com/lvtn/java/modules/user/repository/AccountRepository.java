package com.lvtn.java.modules.user.repository;

import com.lvtn.java.modules.user.entity.Account;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface AccountRepository extends JpaRepository<Account, Integer> {
    Optional<Account> findByEmail(String email);
    boolean existsByEmail(String email);
    List<Account> findByDeletedFalse();
    List<Account> findByDeletedTrue();

    long countByDeletedFalse();
    long countByCreatedAtBetween(LocalDateTime startDate, LocalDateTime endDate);
}
