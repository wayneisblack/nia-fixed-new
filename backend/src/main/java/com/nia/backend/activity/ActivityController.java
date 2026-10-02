package com.nia.backend.activity;

import java.util.Map;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class ActivityController {
    private final ActivityService activityService;

    public ActivityController(ActivityService activityService) {
        this.activityService = activityService;
    }

    @GetMapping("/api/me/activity")
    public Map<String, Object> activity(@AuthenticationPrincipal Jwt jwt) {
        return Map.of("data", activityService.forUser(jwt.getSubject()));
    }
}
