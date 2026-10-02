package com.nia.backend.account;

import static com.nia.backend.support.ApiAssertions.assertApiError;
import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.Map;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.mockito.junit.jupiter.MockitoSettings;
import org.mockito.quality.Strictness;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.UpdateDefinition;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.nia.backend.user.User;
import com.nia.backend.user.UserRepository;

@ExtendWith(MockitoExtension.class)
@MockitoSettings(strictness = Strictness.LENIENT)
class AccountServiceTest {
    @Mock MongoTemplate mongo;
    @Mock UserRepository users;
    @Mock PasswordEncoder passwordEncoder;
    @InjectMocks AccountService service;

    private User current;

    @BeforeEach
    void currentUser() {
        current = new User();
        current.setId("u1");
        current.setEmail("old@example.com");
        current.setPasswordHash("old-hash");
        when(users.findById("u1")).thenReturn(Optional.of(current));
    }

    @SuppressWarnings("unchecked")
    private Map<String, Object> savedFields() {
        ArgumentCaptor<UpdateDefinition> captor = ArgumentCaptor.forClass(UpdateDefinition.class);
        verify(mongo).updateFirst(any(Query.class), captor.capture(), eq("users"));
        return (Map<String, Object>) captor.getValue().getUpdateObject().get("$set");
    }

    @Test
    void deleteRemovesTheUserTheirApplicationsAndTheirBookmarks() {
        service.delete("u1");

        verify(mongo).remove(any(Query.class), eq("users"));
        verify(mongo).remove(any(Query.class), eq("applications"));
        verify(mongo).remove(any(Query.class), eq("bookmarks"));
        verify(mongo, times(3)).remove(any(Query.class), any(String.class));
    }

    @Test
    void changeEmailLowercasesItAndMarksItUnverified() {
        when(users.existsByEmail("new@example.com")).thenReturn(false);

        String email = service.changeEmail("u1", "  NEW@Example.com ");

        assertThat(email).isEqualTo("new@example.com");
        assertThat(savedFields()).containsEntry("email", "new@example.com").containsEntry("emailVerified", false);
    }

    @Test
    void changeEmailRejectsAnInvalidAddress() {
        assertApiError(() -> service.changeEmail("u1", "not-an-email"), HttpStatus.BAD_REQUEST, "Enter a valid email address.");
        assertApiError(() -> service.changeEmail("u1", null), HttpStatus.BAD_REQUEST, "Enter a valid email address.");
    }

    @Test
    void changeEmailRejectsOneThatIsAlreadyTaken() {
        when(users.existsByEmail("taken@example.com")).thenReturn(true);

        assertApiError(() -> service.changeEmail("u1", "taken@example.com"), HttpStatus.CONFLICT, "That email is already in use.");
        verify(mongo, never()).updateFirst(any(Query.class), any(UpdateDefinition.class), eq("users"));
    }

    @Test
    void changeEmailToYourCurrentAddressSkipsTheDuplicateCheck() {
        service.changeEmail("u1", "old@example.com");

        verify(users, never()).existsByEmail(any());
    }

    @Test
    void changeEmailForAnUnknownUserIs401() {
        when(users.findById("ghost")).thenReturn(Optional.empty());

        assertApiError(() -> service.changeEmail("ghost", "new@example.com"),
            HttpStatus.UNAUTHORIZED, "Your session expired. Please sign in again.");
    }

    @Test
    void changePasswordStoresAFreshHash() {
        when(passwordEncoder.matches("current-pass", "old-hash")).thenReturn(true);
        when(passwordEncoder.encode("brand-new-pass")).thenReturn("new-hash");

        service.changePassword("u1", "current-pass", "brand-new-pass");

        assertThat(savedFields()).containsEntry("passwordHash", "new-hash");
    }

    @Test
    void changePasswordRejectsAWrongCurrentPassword() {
        when(passwordEncoder.matches("wrong", "old-hash")).thenReturn(false);

        assertApiError(() -> service.changePassword("u1", "wrong", "brand-new-pass"),
            HttpStatus.BAD_REQUEST, "Current password is incorrect.");
        verify(mongo, never()).updateFirst(any(Query.class), any(UpdateDefinition.class), eq("users"));
    }

    @Test
    void changePasswordRejectsAShortNewPassword() {
        assertApiError(() -> service.changePassword("u1", "current-pass", "short"),
            HttpStatus.BAD_REQUEST, "Your new password must be at least 8 characters.");
    }

    @Test
    void changePasswordForAnUnknownUserIs401() {
        when(users.findById("ghost")).thenReturn(Optional.empty());

        assertApiError(() -> service.changePassword("ghost", "current-pass", "brand-new-pass"),
            HttpStatus.UNAUTHORIZED, "Your session expired. Please sign in again.");
    }
}
