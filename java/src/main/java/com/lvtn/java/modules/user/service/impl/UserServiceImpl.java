package com.lvtn.java.modules.user.service.impl;

import com.lvtn.java.modules.user.entity.Account;
import com.lvtn.java.modules.user.entity.User;
import com.lvtn.java.dto.user.UserRequest;
import com.lvtn.java.dto.user.UserResponse;
import com.lvtn.java.modules.user.repository.AccountRepository;
import com.lvtn.java.modules.user.repository.UserRepository;
import com.lvtn.java.modules.user.service.UserService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {
    private final UserRepository userRepository;
    private final AccountRepository accountRepository;
    private final ModelMapper mapper;
    private final PasswordEncoder passwordEncoder;

    private UserResponse mapToResponse(User user) {
        return mapper.map(user, UserResponse.class);
    }


    private void checkAdminOrStaffRole(Integer accountId) {
        Account account = accountRepository.findById(accountId)
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy thông tin nhân viên thao tác"));

        if (account.getRole() == null) {
            throw new RuntimeException("Từ chối truy cập: Tài khoản chưa được phân quyền!");
        }

        String roleName = account.getRole().getName().toLowerCase();
        if (!roleName.contains("admin") && !roleName.contains("staff")) {
            throw new RuntimeException("Từ chối truy cập: Chỉ nhân viên nội bộ hệ thống mới có quyền này!");
        }
    }

    @Override
    public List<UserResponse> findAllActive() {
        return userRepository.findByDeletedFalse().stream().map(this::mapToResponse).toList();
    }

    @Override
    public List<UserResponse> findAllTrash() {
        return userRepository.findByDeletedTrue().stream().map(this::mapToResponse).toList();
    }

    @Override
    public UserResponse findById(Integer id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy khách hàng ID: " + id));
        return mapToResponse(user);
    }

    @Override
    @Transactional
    public UserResponse create(UserRequest request, Integer accountId) {
        checkAdminOrStaffRole(accountId);

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email khách hàng đã tồn tại!");
        }
        if (request.getPassword() == null || request.getPassword().isBlank()) {
            throw new RuntimeException("Mật khẩu không được để trống!");
        }

        mapper.typeMap(UserRequest.class, User.class).addMappings(m -> m.skip(User::setPassword));
        User user = mapper.map(request, User.class);

        user.setPassword(passwordEncoder.encode(request.getPassword()));

        if (user.getStatus() == null) user.setStatus("active");

        return mapToResponse(userRepository.save(user));
    }

    @Override
    @Transactional
    public UserResponse update(Integer id, UserRequest request, Integer accountId) {
        checkAdminOrStaffRole(accountId);

        User user = userRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy khách hàng ID: " + id));

        if (!user.getEmail().equals(request.getEmail()) && userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email này đã được khách hàng khác sử dụng!");
        }

        user.setFullName(request.getFullName());
        user.setEmail(request.getEmail());

        if (request.getStatus() != null) user.setStatus(request.getStatus());

        if (request.getPassword() != null && !request.getPassword().isBlank()) {
            user.setPassword(passwordEncoder.encode(request.getPassword()));
        }

        return mapToResponse(userRepository.save(user));
    }

    @Override
    @Transactional
    public void delete(Integer id, Integer accountId) {
        checkAdminOrStaffRole(accountId);

        User user = userRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy khách hàng ID: " + id));

        user.setDeleted(true);
        user.setDeletedAt(LocalDateTime.now());
        user.setDeletedBy(accountId);

        userRepository.save(user);
    }

    @Override
    @Transactional
    public void restore(Integer id, Integer accountId) {
        checkAdminOrStaffRole(accountId);

        User user = userRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy khách hàng ID: " + id));

        user.setDeleted(false);
        user.setDeletedAt(null);
        user.setDeletedBy(null);

        userRepository.save(user);
    }

    @Override
    @Transactional
    public void hardDelete(Integer id, Integer accountId) {
        checkAdminOrStaffRole(accountId);

        User user = userRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy khách hàng ID: " + id));

        userRepository.delete(user);
    }
}