package com.nia.backend.application;

import static com.nia.backend.support.ApiAssertions.assertApiError;
import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.mockito.junit.jupiter.MockitoSettings;
import org.mockito.quality.Strictness;
import org.springframework.http.HttpStatus;

@ExtendWith(MockitoExtension.class)
@MockitoSettings(strictness = Strictness.LENIENT)
class ApplicationServiceTest {
    @Mock ApplicationRepository applications;
    @InjectMocks ApplicationService service;

    private Map<String, Object> validBody() {
        Map<String, Object> body = new HashMap<>();
        body.put("fullName", "  Ada Obi ");
        body.put("email", "ada@example.com");
        body.put("motivation", "I love building things.");
        body.put("portfolioUrl", "   ");
        body.put("opportunityId", "frontend-developer-intern");
        body.put("opportunityTitle", "Frontend Developer Intern");
        body.put("opportunityOrganization", "TechNova");
        return body;
    }

    private void saveReturnsArgument() {
        when(applications.save(any(Application.class))).thenAnswer(invocation -> invocation.getArgument(0));
    }

    @Test
    void createStoresAnActiveApplicationForTheUser() {
        saveReturnsArgument();
        when(applications.findByUserIdAndOpportunityIdAndStatus("u1", "frontend-developer-intern", "Active"))
            .thenReturn(Optional.empty());

        Application saved = service.create("u1", validBody());

        assertThat(saved.getId()).isNotBlank();
        assertThat(saved.getUserId()).isEqualTo("u1");
        assertThat(saved.getFullName()).isEqualTo("Ada Obi");
        assertThat(saved.getStatus()).isEqualTo("Active");
        assertThat(saved.getPortfolioUrl()).isNull();
        assertThat(saved.getOpportunityTitle()).isEqualTo("Frontend Developer Intern");
        assertThat(saved.getCreatedAt()).isNotNull();
    }

    @Test
    void missingRequiredFieldsAreRejected() {
        Map<String, Object> body = validBody();
        body.put("motivation", "  ");

        assertApiError(() -> service.create("u1", body),
            HttpStatus.BAD_REQUEST, "Full name, email, and motivation are required.");
        verify(applications, never()).save(any(Application.class));
    }

    @Test
    void applyingTwiceToTheSameOpportunityIsAConflict() {
        when(applications.findByUserIdAndOpportunityIdAndStatus("u1", "frontend-developer-intern", "Active"))
            .thenReturn(Optional.of(new Application()));

        assertApiError(() -> service.create("u1", validBody()),
            HttpStatus.CONFLICT, "You've already applied to this opportunity.");
        verify(applications, never()).save(any(Application.class));
    }

    @Test
    void applicationWithoutAnOpportunitySkipsTheDuplicateCheck() {
        saveReturnsArgument();
        Map<String, Object> body = validBody();
        body.remove("opportunityId");

        Application saved = service.create("u1", body);

        assertThat(saved.getOpportunityId()).isNull();
        verify(applications, never()).findByUserIdAndOpportunityIdAndStatus(any(), any(), any());
    }

    @Test
    void cancelMarksTheApplicationCancelled() {
        saveReturnsArgument();
        Application existing = new Application();
        existing.setId("a1");
        existing.setUserId("u1");
        existing.setStatus("Active");
        when(applications.findByIdAndUserId("a1", "u1")).thenReturn(Optional.of(existing));

        Application cancelled = service.cancel("u1", "a1");

        assertThat(cancelled.getStatus()).isEqualTo("Cancelled");
        assertThat(cancelled.getCancelledAt()).isNotNull();
    }

    @Test
    void cancellingSomeoneElsesOrUnknownApplicationIs404() {
        when(applications.findByIdAndUserId("a1", "u2")).thenReturn(Optional.empty());

        assertApiError(() -> service.cancel("u2", "a1"), HttpStatus.NOT_FOUND, "Application not found.");
        verify(applications, never()).save(any(Application.class));
    }

    @Test
    void listReturnsTheUsersApplications() {
        Application first = new Application();
        first.setId("a1");
        when(applications.findByUserIdOrderByCreatedAtDesc("u1")).thenReturn(List.of(first));

        assertThat(service.list("u1")).containsExactly(first);
    }
}
