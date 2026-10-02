package com.nia.backend.user;

import static com.nia.backend.support.ApiAssertions.assertApiError;
import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.mockito.junit.jupiter.MockitoSettings;
import org.mockito.quality.Strictness;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;

@ExtendWith(MockitoExtension.class)
@MockitoSettings(strictness = Strictness.LENIENT)
class UserServiceTest {
    @Mock UserRepository users;
    @Mock PasswordEncoder passwordEncoder;
    @InjectMocks UserService service;

    private void saveReturnsArgument() {
        when(users.save(any(User.class))).thenAnswer(invocation -> invocation.getArgument(0));
    }

    @Test
    void registersTalentWithNormalisedEmailAndHashedPassword() {
        when(users.existsByEmail("ada@example.com")).thenReturn(false);
        when(passwordEncoder.encode("password1")).thenReturn("hashed");
        saveReturnsArgument();

        User saved = service.register(new RegistrationRequest("  Ada ", " ADA@Example.com ", "password1", null, null));

        assertThat(saved.getName()).isEqualTo("Ada");
        assertThat(saved.getEmail()).isEqualTo("ada@example.com");
        assertThat(saved.getPasswordHash()).isEqualTo("hashed");
        assertThat(saved.getRole()).isEqualTo("talent");
        assertThat(saved.getCompanyName()).isNull();
        assertThat(saved.getOnboardingStep()).isEqualTo("identity");
        assertThat(saved.isOnboardingComplete()).isFalse();
        assertThat(saved.isEmailVerified()).isFalse();
        assertThat(saved.getCreatedAt()).isNotNull();
    }

    @Test
    void neverStoresThePlainPassword() {
        when(passwordEncoder.encode("password1")).thenReturn("hashed");
        saveReturnsArgument();

        User saved = service.register(new RegistrationRequest("Ada", "ada@example.com", "password1", "talent", null));

        assertThat(saved.getPasswordHash()).isNotEqualTo("password1");
    }

    @Test
    void employerAccountKeepsTrimmedCompanyName() {
        when(passwordEncoder.encode("password1")).thenReturn("hashed");
        saveReturnsArgument();

        User saved = service.register(new RegistrationRequest("Bola", "bola@acme.com", "password1", "employer", " Acme "));

        assertThat(saved.getRole()).isEqualTo("employer");
        assertThat(saved.getCompanyName()).isEqualTo("Acme");
    }

    @Test
    void employerWithoutCompanyNameIsRejected() {
        assertApiError(
            () -> service.register(new RegistrationRequest("Bola", "bola@acme.com", "password1", "employer", "   ")),
            HttpStatus.BAD_REQUEST, "Company name is required for employer accounts.");
        verify(users, never()).save(any(User.class));
    }

    @Test
    void unknownRoleFallsBackToTalent() {
        when(passwordEncoder.encode("password1")).thenReturn("hashed");
        saveReturnsArgument();

        User saved = service.register(new RegistrationRequest("Eve", "eve@example.com", "password1", "admin", null));

        assertThat(saved.getRole()).isEqualTo("talent");
    }

    @Test
    void duplicateEmailIsRejectedWithConflict() {
        when(users.existsByEmail("ada@example.com")).thenReturn(true);

        assertApiError(
            () -> service.register(new RegistrationRequest("Ada", "ada@example.com", "password1", null, null)),
            HttpStatus.CONFLICT, "An account with this email already exists.");
        verify(users, never()).save(any(User.class));
    }

    @Test
    void duplicateKeyRaceIsAlsoReportedAsConflict() {
        when(passwordEncoder.encode("password1")).thenReturn("hashed");
        when(users.save(any(User.class))).thenThrow(new DuplicateKeyException("duplicate"));

        assertApiError(
            () -> service.register(new RegistrationRequest("Ada", "ada@example.com", "password1", null, null)),
            HttpStatus.CONFLICT, "An account with this email already exists.");
    }
}
