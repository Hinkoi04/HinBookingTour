package com.lvtn.java.modules.user.repository;

import com.lvtn.java.modules.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Integer> {
    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);
    List<User> findByDeletedFalse();
    List<User> findByDeletedTrue();
}
