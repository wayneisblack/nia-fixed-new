package com.nia.backend.auth;

import java.time.Instant;
import java.time.temporal.ChronoUnit;

import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.JwsHeader;
import org.springframework.security.oauth2.jwt.JwtClaimsSet;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtEncoderParameters;
import org.springframework.stereotype.Service;

import com.nia.backend.common.ApiException;
import com.nia.backend.user.User;
import com.nia.backend.user.UserRepository;

@Service
public class AuthService {
    public record LoginResult(String token, User user) {}

    private final UserRepository users;
    private final JwtEncoder jwtEncoder;
    private final PasswordEncoder passwordEncoder;

    public AuthService(UserRepository users, JwtEncoder jwtEncoder, PasswordEncoder passwordEncoder) {
        this.users = users;
        this.jwtEncoder = jwtEncoder;
        this.passwordEncoder = passwordEncoder;
    }

    public LoginResult login(LoginRequest request) {
        User user = users.findByEmail(request.email().trim().toLowerCase()).orElse(null);
        if (user == null || !passwordEncoder.matches(request.password(), user.getPasswordHash())) {
            throw new ApiException(HttpStatus.UNAUTHORIZED, "Invalid email or password.");
        }

        Instant now = Instant.now();
        JwtClaimsSet claims = JwtClaimsSet.builder()
            .issuer("nia-backend")
            .subject(user.getId())
            .issuedAt(now)
            .expiresAt(now.plus(7, ChronoUnit.DAYS))
            .claim("role", user.getRole() == null ? "talent" : user.getRole())
            .claim("email", user.getEmail())
            .build();
        String token = jwtEncoder.encode(JwtEncoderParameters.from(
            JwsHeader.with(MacAlgorithm.HS256).build(), claims)).getTokenValue();

        return new LoginResult(token, user);
    }
}
