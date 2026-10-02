package com.nia.backend.application;

import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/applications")
public class ApplicationController {
    private final ApplicationService applicationService;

    public ApplicationController(ApplicationService applicationService) {
        this.applicationService = applicationService;
    }

    @GetMapping
    public Map<String, Object> list(@AuthenticationPrincipal Jwt jwt) {
        List<Application> records = applicationService.list(jwt.getSubject());
        return Map.of("data", records, "count", records.size());
    }

    @PostMapping
    public ResponseEntity<Map<String, Object>> create(@AuthenticationPrincipal Jwt jwt, @RequestBody Map<String, Object> body) {
        Application saved = applicationService.create(jwt.getSubject(), body);
        return ResponseEntity.status(HttpStatus.CREATED).body(Map.of(
            "message", "Application submitted successfully.", "data", saved));
    }

    @PostMapping("/{id}/cancel")
    public Map<String, Object> cancel(@AuthenticationPrincipal Jwt jwt, @PathVariable String id) {
        Application saved = applicationService.cancel(jwt.getSubject(), id);
        return Map.of("message", "Application cancelled.", "data", saved);
    }
}
