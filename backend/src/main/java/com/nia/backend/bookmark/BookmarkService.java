package com.nia.backend.bookmark;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import com.nia.backend.common.ApiException;

@Service
public class BookmarkService {
    private final BookmarkRepository bookmarks;

    public BookmarkService(BookmarkRepository bookmarks) {
        this.bookmarks = bookmarks;
    }

    public List<Bookmark> list(String userId) {
        return bookmarks.findByUserIdOrderByCreatedAtDesc(userId);
    }

    /** Saves the opportunity if it isn't saved yet, otherwise removes it. Returns true when it is now saved. */
    public boolean toggle(String userId, String opportunityId) {
        if (opportunityId == null || opportunityId.isBlank()) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "opportunityId is required.");
        }

        var existing = bookmarks.findByUserIdAndOpportunityId(userId, opportunityId);
        if (existing.isPresent()) {
            bookmarks.delete(existing.get());
            return false;
        }

        Bookmark bookmark = new Bookmark();
        bookmark.setId(UUID.randomUUID().toString());
        bookmark.setUserId(userId);
        bookmark.setOpportunityId(opportunityId);
        bookmark.setCreatedAt(Instant.now());
        bookmarks.save(bookmark);
        return true;
    }
}
