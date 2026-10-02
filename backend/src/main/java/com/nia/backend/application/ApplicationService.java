package com.nia.backend.application;

import java.time.Instant;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import com.nia.backend.common.ApiException;

@Service
public class ApplicationService {
    private final ApplicationRepository applications;

    public ApplicationService(ApplicationRepository applications) {
        this.applications = applications;
    }

    public List<Application> list(String userId) {
        return applications.findByUserIdOrderByCreatedAtDesc(userId);
    }

    public Application create(String userId, Map<String, Object> body) {
        String fullName = text(body.get("fullName"));
        String email = text(body.get("email"));
        String motivation = text(body.get("motivation"));
        if (fullName.isBlank() || email.isBlank() || motivation.isBlank()) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "Full name, email, and motivation are required.");
        }

        String opportunityId = textOrNull(body.get("opportunityId"));
        if (opportunityId != null
                && applications.findByUserIdAndOpportunityIdAndStatus(userId, opportunityId, "Active").isPresent()) {
            throw new ApiException(HttpStatus.CONFLICT, "You've already applied to this opportunity.");
        }

        Application application = new Application();
        application.setId(UUID.randomUUID().toString());
        application.setUserId(userId);
        application.setFullName(fullName);
        application.setEmail(email);
        application.setMotivation(motivation);
        application.setPortfolioUrl(textOrNull(body.get("portfolioUrl")));
        application.setOpportunityId(opportunityId);
        application.setOpportunityTitle(textOrNull(body.get("opportunityTitle")));
        application.setOpportunityOrganization(textOrNull(body.get("opportunityOrganization")));
        application.setCreatedAt(Instant.now());
        application.setStatus("Active");
        return applications.save(application);
    }

    public Application cancel(String userId, String applicationId) {
        Application application = applications.findByIdAndUserId(applicationId, userId)
            .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Application not found."));
        application.setStatus("Cancelled");
        application.setCancelledAt(Instant.now());
        return applications.save(application);
    }

    private String text(Object value) {
        return value instanceof String string ? string.trim() : "";
    }

    private String textOrNull(Object value) {
        String text = text(value);
        return text.isBlank() ? null : text;
    }
}
