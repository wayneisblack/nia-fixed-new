package com.nia.backend.bookmark;

import java.util.Map;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/bookmarks")
public class BookmarkController {
    private final BookmarkService bookmarkService;

    public BookmarkController(BookmarkService bookmarkService) {
        this.bookmarkService = bookmarkService;
    }

    @GetMapping
    public Map<String, Object> list(@AuthenticationPrincipal Jwt jwt) {
        return Map.of("data", bookmarkService.list(jwt.getSubject()));
    }

    @PostMapping
    public Map<String, Object> toggle(@AuthenticationPrincipal Jwt jwt, @RequestBody Map<String, Object> body) {
        String opportunityId = body.get("opportunityId") instanceof String value ? value : "";
        boolean saved = bookmarkService.toggle(jwt.getSubject(), opportunityId);
        return Map.of("data", Map.of("opportunityId", opportunityId, "saved", saved));
    }
}
