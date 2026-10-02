package com.nia.backend.activity;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.when;

import java.util.List;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.mockito.junit.jupiter.MockitoSettings;
import org.mockito.quality.Strictness;

import com.nia.backend.application.Application;
import com.nia.backend.application.ApplicationRepository;
import com.nia.backend.bookmark.Bookmark;
import com.nia.backend.bookmark.BookmarkRepository;

@ExtendWith(MockitoExtension.class)
@MockitoSettings(strictness = Strictness.LENIENT)
class ActivityServiceTest {
    @Mock ApplicationRepository applications;
    @Mock BookmarkRepository bookmarks;
    @InjectMocks ActivityService service;

    private Application application(String id, String opportunityId, String status) {
        Application application = new Application();
        application.setId(id);
        application.setOpportunityId(opportunityId);
        application.setStatus(status);
        return application;
    }

    private Bookmark bookmark(String opportunityId) {
        Bookmark bookmark = new Bookmark();
        bookmark.setOpportunityId(opportunityId);
        return bookmark;
    }

    @Test
    void onlyActiveApplicationsCountAsApplied() {
        when(applications.findByUserIdOrderByCreatedAtDesc("u1")).thenReturn(List.of(
            application("a1", "opp-1", "Active"),
            application("a2", "opp-2", "Cancelled"),
            application("a3", "opp-3", "Active"),
            application("a4", null, "Active")));
        when(bookmarks.findByUserIdOrderByCreatedAtDesc("u1")).thenReturn(List.of(bookmark("opp-1"), bookmark("opp-4")));

        ActivityService.Activity activity = service.forUser("u1");

        assertThat(activity.appliedOpportunityIds()).containsExactly("opp-1", "opp-3");
        assertThat(activity.savedOpportunityIds()).containsExactly("opp-1", "opp-4");
        assertThat(activity.activeApplicationsByOpportunity())
            .containsEntry("opp-1", "a1")
            .containsEntry("opp-3", "a3")
            .hasSize(2);
    }

    @Test
    void newUserHasNoActivity() {
        when(applications.findByUserIdOrderByCreatedAtDesc("new")).thenReturn(List.of());
        when(bookmarks.findByUserIdOrderByCreatedAtDesc("new")).thenReturn(List.of());

        ActivityService.Activity activity = service.forUser("new");

        assertThat(activity.appliedOpportunityIds()).isEmpty();
        assertThat(activity.savedOpportunityIds()).isEmpty();
        assertThat(activity.activeApplicationsByOpportunity()).isEmpty();
    }

    @Test
    void duplicateActiveApplicationsKeepTheNewestOne() {
        // The repository returns newest first, so the first match wins.
        when(applications.findByUserIdOrderByCreatedAtDesc("u1")).thenReturn(List.of(
            application("newer", "opp-1", "Active"),
            application("older", "opp-1", "Active")));
        when(bookmarks.findByUserIdOrderByCreatedAtDesc("u1")).thenReturn(List.of());

        assertThat(service.forUser("u1").activeApplicationsByOpportunity()).containsEntry("opp-1", "newer");
    }
}
