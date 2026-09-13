package com.lvtn.java.modules.user.repository;

import com.lvtn.java.modules.user.entity.Account;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface AccountRepository extends JpaRepository<Account, Integer> {
    Optional<Account> findByEmail(String email);
    boolean existsByEmail(String email);
    @Query("SELECT a FROM Account a JOIN FETCH a.role WHERE a.deleted = false")
    List<Account> findByDeletedFalse();
    @Query("SELECT a FROM Account a JOIN FETCH a.role WHERE a.deleted = true")
    List<Account> findByDeletedTrue();

    long countByDeletedFalse();
    long countByCreatedAtBetween(LocalDateTime startDate, LocalDateTime endDate);
}
