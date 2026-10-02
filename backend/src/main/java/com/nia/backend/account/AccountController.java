package com.nia.backend.account;

import java.util.Map;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/account")
public class AccountController {
    private final AccountService accountService;

    public AccountController(AccountService accountService) {
        this.accountService = accountService;
    }

    @DeleteMapping
    public Map<String, Object> delete(@AuthenticationPrincipal Jwt jwt) {
        accountService.delete(jwt.getSubject());
        return Map.of("data", Map.of("ok", true));
    }

    @PatchMapping("/email")
    public Map<String, Object> email(@AuthenticationPrincipal Jwt jwt, @RequestBody Map<String, Object> body) {
        String email = accountService.changeEmail(jwt.getSubject(), asText(body.get("email")));
        return Map.of("data", Map.of("email", email, "emailVerified", false));
    }

    @PatchMapping("/password")
    public Map<String, Object> password(@AuthenticationPrincipal Jwt jwt, @RequestBody Map<String, Object> body) {
        accountService.changePassword(jwt.getSubject(), asText(body.get("currentPassword")), asText(body.get("newPassword")));
        return Map.of("data", Map.of("ok", true));
    }

    private String asText(Object value) {
        return value instanceof String string ? string : "";
    }
}
