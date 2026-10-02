package com.nia.backend.bookmark;

import static com.nia.backend.support.ApiAssertions.assertApiError;
import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentCaptor.forClass;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.mockito.junit.jupiter.MockitoSettings;
import org.mockito.quality.Strictness;
import org.springframework.http.HttpStatus;

@ExtendWith(MockitoExtension.class)
@MockitoSettings(strictness = Strictness.LENIENT)
class BookmarkServiceTest {
    @Mock BookmarkRepository bookmarks;
    @InjectMocks BookmarkService service;

    @Test
    void firstToggleSavesTheOpportunity() {
        when(bookmarks.findByUserIdAndOpportunityId("u1", "opp-1")).thenReturn(Optional.empty());

        boolean saved = service.toggle("u1", "opp-1");

        assertThat(saved).isTrue();
        ArgumentCaptor<Bookmark> captor = forClass(Bookmark.class);
        verify(bookmarks).save(captor.capture());
        assertThat(captor.getValue().getUserId()).isEqualTo("u1");
        assertThat(captor.getValue().getOpportunityId()).isEqualTo("opp-1");
        assertThat(captor.getValue().getId()).isNotBlank();
        assertThat(captor.getValue().getCreatedAt()).isNotNull();
    }

    @Test
    void secondToggleRemovesIt() {
        Bookmark existing = new Bookmark();
        existing.setOpportunityId("opp-1");
        when(bookmarks.findByUserIdAndOpportunityId("u1", "opp-1")).thenReturn(Optional.of(existing));

        boolean saved = service.toggle("u1", "opp-1");

        assertThat(saved).isFalse();
        verify(bookmarks).delete(existing);
        verify(bookmarks, never()).save(any(Bookmark.class));
    }

    @Test
    void blankOpportunityIdIsRejected() {
        assertApiError(() -> service.toggle("u1", "  "), HttpStatus.BAD_REQUEST, "opportunityId is required.");
        assertApiError(() -> service.toggle("u1", null), HttpStatus.BAD_REQUEST, "opportunityId is required.");
    }

    @Test
    void listReturnsTheUsersBookmarks() {
        Bookmark bookmark = new Bookmark();
        bookmark.setOpportunityId("opp-1");
        when(bookmarks.findByUserIdOrderByCreatedAtDesc("u1")).thenReturn(List.of(bookmark));

        assertThat(service.list("u1")).containsExactly(bookmark);
    }
}
