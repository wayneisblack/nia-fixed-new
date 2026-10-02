package com.nia.backend.activity;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.nia.backend.application.Application;
import com.nia.backend.application.ApplicationRepository;
import com.nia.backend.bookmark.Bookmark;
import com.nia.backend.bookmark.BookmarkRepository;

@Service
public class ActivityService {
    /** What the frontend needs to mark opportunities as applied / saved. */
    public record Activity(
        List<String> appliedOpportunityIds,
        List<String> savedOpportunityIds,
        Map<String, String> activeApplicationsByOpportunity) {}

    private final ApplicationRepository applications;
    private final BookmarkRepository bookmarks;

    public ActivityService(ApplicationRepository applications, BookmarkRepository bookmarks) {
        this.applications = applications;
        this.bookmarks = bookmarks;
    }

    public Activity forUser(String userId) {
        List<Application> active = applications.findByUserIdOrderByCreatedAtDesc(userId).stream()
            .filter(application -> "Active".equals(application.getStatus()) && application.getOpportunityId() != null)
            .toList();
        List<Bookmark> saved = bookmarks.findByUserIdOrderByCreatedAtDesc(userId);

        Map<String, String> activeByOpportunity = active.stream().collect(Collectors.toMap(
            Application::getOpportunityId, Application::getId, (first, ignored) -> first, LinkedHashMap::new));

        return new Activity(
            active.stream().map(Application::getOpportunityId).toList(),
            saved.stream().map(Bookmark::getOpportunityId).filter(Objects::nonNull).toList(),
            activeByOpportunity);
    }
}
