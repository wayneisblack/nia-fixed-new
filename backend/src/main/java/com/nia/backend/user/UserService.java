package com.nia.backend.user;

import java.time.Instant;
import java.util.List;

import org.springframework.dao.DuplicateKeyException;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.nia.backend.common.ApiException;

@Service
public class UserService {
    private final UserRepository users;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository users, PasswordEncoder passwordEncoder) {
        this.users = users;
        this.passwordEncoder = passwordEncoder;
    }

    public User register(RegistrationRequest request) {
        String email = request.email().trim().toLowerCase();
        String role = "employer".equals(request.role()) ? "employer" : "talent";
        String companyName = request.companyName() == null ? "" : request.companyName().trim();

        if ("employer".equals(role) && companyName.isBlank()) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "Company name is required for employer accounts.");
        }
        if (users.existsByEmail(email)) {
            throw emailTaken();
        }

        User user = new User();
        user.setName(request.name().trim());
        user.setEmail(email);
        user.setPasswordHash(passwordEncoder.encode(request.password()));
        user.setRole(role);
        user.setCompanyName("employer".equals(role) ? companyName : null);
        user.setCategories(List.of());
        user.setSkills(List.of());
        user.setOnboardingStep("identity");
        user.setOnboardingComplete(false);
        user.setEmailVerified(false);
        user.setCreatedAt(Instant.now());

        try {
            return users.save(user);
        } catch (DuplicateKeyException exception) {
            // Two sign-ups with the same email at the same moment.
            throw emailTaken();
        }
    }

    private ApiException emailTaken() {
        return new ApiException(HttpStatus.CONFLICT, "An account with this email already exists.");
    }
}
