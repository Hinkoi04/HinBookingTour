package com.lvtn.java.security;

import com.lvtn.java.modules.user.entity.Account;
import com.lvtn.java.modules.user.repository.AccountRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class PermissionCheckService {

    private final AccountRepository accountRepository;

    public boolean hasPermission(Integer accountId, String permissionKey) {
        if (accountId == null || permissionKey == null) return false;

        Account account = accountRepository.findById(accountId).orElse(null);

        if (account == null || account.getRole() == null) {
            return false;
        }

        if ("ADMIN".equalsIgnoreCase(account.getRole().getName())) {
            return true;
        }
        if (account.getRole().getPermissions() == null) {
            return false;
        }

        return account.getRole().getPermissions().stream()
                .anyMatch(p -> permissionKey.equalsIgnoreCase(p.getPermissionKey()));
    }
}