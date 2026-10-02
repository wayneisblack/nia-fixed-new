package com.nia.backend.profile;

import static com.nia.backend.support.ApiAssertions.assertApiError;
import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.HashMap;
import java.util.List;
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

import com.nia.backend.user.User;
import com.nia.backend.user.UserRepository;

@ExtendWith(MockitoExtension.class)
@MockitoSettings(strictness = Strictness.LENIENT)
class ProfileServiceTest {
    @Mock MongoTemplate mongo;
    @Mock UserRepository users;
    @InjectMocks ProfileService service;

    @BeforeEach
    void userExists() {
        when(users.findById("u1")).thenReturn(Optional.of(new User()));
    }

    /** The fields that were written to MongoDB with $set. */
    @SuppressWarnings("unchecked")
    private Map<String, Object> savedFields() {
        ArgumentCaptor<UpdateDefinition> captor = ArgumentCaptor.forClass(UpdateDefinition.class);
        verify(mongo).updateFirst(any(Query.class), captor.capture(), eq("users"));
        return (Map<String, Object>) captor.getValue().getUpdateObject().get("$set");
    }

    @Test
    void unknownUserGets401() {
        when(users.findById("ghost")).thenReturn(Optional.empty());

        assertApiError(() -> service.update("ghost", Map.of("about", "hi")),
            HttpStatus.UNAUTHORIZED, "Your session expired. Please sign in again.");
        verify(mongo, never()).updateFirst(any(Query.class), any(UpdateDefinition.class), eq("users"));
    }

    @Test
    void emptyRequestIsRejected() {
        assertApiError(() -> service.update("u1", new HashMap<>()), HttpStatus.BAD_REQUEST, "Nothing to update.");
    }

    @Test
    void skillsAreTrimmedAndDeduplicated() {
        Map<String, Object> saved = service.update("u1", Map.of("skills", List.of(" Java ", "Java", "", "Spring", 42)));

        assertThat(saved.get("skills")).isEqualTo(List.of("Java", "Spring"));
        assertThat(savedFields().get("skills")).isEqualTo(List.of("Java", "Spring"));
    }

    @Test
    void aboutTextIsTrimmedAndCappedAt2000Characters() {
        Map<String, Object> saved = service.update("u1", Map.of("about", "  " + "x".repeat(2500) + "  "));

        assertThat((String) saved.get("about")).hasSize(2000);
    }

    @Test
    void validLocationIsSaved() {
        Map<String, Object> saved = service.update("u1",
            Map.of("location", Map.of("country", " Nigeria ", "region", "Lagos", "city", "Ikeja")));

        assertThat(saved.get("location")).isEqualTo(Map.of("country", "Nigeria", "region", "Lagos", "city", "Ikeja"));
    }

    @Test
    void locationWithoutCityIsRejected() {
        assertApiError(() -> service.update("u1", Map.of("location", Map.of("country", "Nigeria", "region", "", "city", ""))),
            HttpStatus.BAD_REQUEST, "Location must include a valid country and city.");
    }

    @Test
    void locationThatIsNotAnObjectIsRejected() {
        assertApiError(() -> service.update("u1", Map.of("location", "Lagos")),
            HttpStatus.BAD_REQUEST, "Location must include a valid country and city.");
    }

    @Test
    void phoneCanBeSetAndCleared() {
        Map<String, Object> set = service.update("u1", Map.of("phone", Map.of("dialCode", "+234", "number", "8012345678")));
        assertThat(set.get("phone")).isEqualTo(Map.of("dialCode", "+234", "number", "8012345678"));

        Map<String, Object> body = new HashMap<>();
        body.put("phone", null);
        Map<String, Object> cleared = service.update("u1", body);
        assertThat(cleared).containsKey("phone");
        assertThat(cleared.get("phone")).isNull();
    }

    @Test
    void invalidPhoneIsRejected() {
        assertApiError(() -> service.update("u1", Map.of("phone", "08012345678")),
            HttpStatus.BAD_REQUEST, "Enter a valid phone number and country code.");
    }

    @Test
    void experienceOnlyUpdateIsAccepted() {
        // Regression: experience/education/preferences used to be saved without being reported,
        // so a request containing only those fields was refused as "Nothing to update."
        List<Map<String, String>> experience = List.of(Map.of("title", "Intern", "company", "Acme"));

        Map<String, Object> saved = service.update("u1", Map.of("experience", experience));

        assertThat(saved).containsKey("experience");
        assertThat(savedFields().get("experience")).isEqualTo(experience);
    }

    @Test
    void educationAndPreferencesAreAcceptedToo() {
        Map<String, Object> saved = service.update("u1", Map.of(
            "education", List.of(Map.of("school", "UNILAG")),
            "preferences", Map.of("remote", true)));

        assertThat(saved).containsKeys("education", "preferences");
    }

    @Test
    void onboardingProgressIsSaved() {
        Map<String, Object> saved = service.update("u1", Map.of("onboardingStep", "skills", "onboardingComplete", true));

        assertThat(saved).containsEntry("onboardingStep", "skills").containsEntry("onboardingComplete", true);
    }

    @Test
    void unknownFieldsAreIgnored() {
        assertApiError(() -> service.update("u1", Map.of("passwordHash", "hacked", "role", "employer")),
            HttpStatus.BAD_REQUEST, "Nothing to update.");
        verify(mongo, never()).updateFirst(any(Query.class), any(UpdateDefinition.class), eq("users"));
    }
}
