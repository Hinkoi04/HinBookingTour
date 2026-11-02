package com.lvtn.java.modules.auth.service.impl;

import com.lvtn.java.config.AppJwtProperties;
import com.lvtn.java.dto.auth.LoginRequest;
import com.lvtn.java.modules.role.repository.RoleRepository;
import com.lvtn.java.modules.user.entity.User;
import com.lvtn.java.modules.user.repository.AccountRepository;
import com.lvtn.java.modules.user.repository.UserRepository;
import com.lvtn.java.security.JwtService;
import org.junit.jupiter.api.Test;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.when;

class AuthServiceImplTest {
    @Test
    void loginRejectsInactiveCustomerBeforeCheckingPassword() {
        AccountRepository accountRepository = mock(AccountRepository.class);
        PasswordEncoder passwordEncoder = mock(PasswordEncoder.class);
        UserRepository userRepository = mock(UserRepository.class);
        User customer = new User();
        customer.setStatus("inactive");
        customer.setDeleted(false);
        when(userRepository.findByEmail("customer@example.com")).thenReturn(Optional.of(customer));

        AuthServiceImpl authService = createService(accountRepository, passwordEncoder, userRepository);

        BadCredentialsException exception = assertThrows(
                BadCredentialsException.class,
                () -> authService.login(new LoginRequest("customer@example.com", "password")));

        assertEquals("Tài khoản đã bị khóa", exception.getMessage());
        verify(accountRepository, never()).findByEmail("customer@example.com");
        verifyNoInteractions(passwordEncoder);
    }

    @Test
    void loginRejectsSoftDeletedCustomer() {
        AccountRepository accountRepository = mock(AccountRepository.class);
        PasswordEncoder passwordEncoder = mock(PasswordEncoder.class);
        UserRepository userRepository = mock(UserRepository.class);
        User customer = new User();
        customer.setStatus("active");
        customer.setDeleted(true);
        when(userRepository.findByEmail("customer@example.com")).thenReturn(Optional.of(customer));

        AuthServiceImpl authService = createService(accountRepository, passwordEncoder, userRepository);

        BadCredentialsException exception = assertThrows(
                BadCredentialsException.class,
                () -> authService.login(new LoginRequest("customer@example.com", "password")));

        assertEquals("Tài khoản đã bị khóa", exception.getMessage());
        verify(accountRepository, never()).findByEmail("customer@example.com");
    }

    private AuthServiceImpl createService(
            AccountRepository accountRepository,
            PasswordEncoder passwordEncoder,
            UserRepository userRepository) {
        return new AuthServiceImpl(
                accountRepository,
                mock(RoleRepository.class),
                mock(JwtService.class),
                mock(AppJwtProperties.class),
                passwordEncoder,
                userRepository);
    }
}
