package com.lvtn.java.modules.user.service;

import com.lvtn.java.dto.user.UserRequest;
import com.lvtn.java.dto.user.UserResponse;

import java.util.List;

public interface UserService {
    List<UserResponse> findAllActive();
    List<UserResponse> findAllTrash();
    UserResponse findById(Integer id);
    UserResponse create(UserRequest request, Integer accountId);
    UserResponse update(Integer id, UserRequest request, Integer accountId);
    void delete(Integer id, Integer accountId);
    void restore(Integer id, Integer accountId);
    void hardDelete(Integer id, Integer accountId);
}
