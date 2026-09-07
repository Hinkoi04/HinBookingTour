package com.lvtn.java.modules.user.service;

import com.lvtn.java.dto.account.AccountRequest;
import com.lvtn.java.dto.account.AccountResponse;

import java.util.List;

public interface AccountService {
    List<AccountResponse> findAllActive();
    List<AccountResponse> findAllTrash();
    AccountResponse findById(Integer id);
    AccountResponse create(AccountRequest request, Integer creatorId);
    AccountResponse update(Integer id, AccountRequest request, String avatarUrl, Integer updaterId);
    void delete(Integer id, Integer deleterId);
    void restore(Integer id, Integer restorerId);
    void hardDelete(Integer id, Integer requesterId);
}