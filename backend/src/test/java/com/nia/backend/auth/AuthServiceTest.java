package com.nia.backend.auth;

import static com.nia.backend.support.ApiAssertions.assertApiError;
import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

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
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtEncoderParameters;

import com.nia.backend.user.User;
import com.nia.backend.user.UserRepository;

@ExtendWith(MockitoExtension.class)
@MockitoSettings(strictness = Strictness.LENIENT)
class AuthServiceTest {
    @Mock UserRepository users;
    @Mock JwtEncoder jwtEncoder;
    @Mock PasswordEncoder passwordEncoder;
    @InjectMocks AuthService service;

    private User ada() {
        User user = new User();
        user.setId("u1");
        user.setName("Ada");
        user.setEmail("ada@example.com");
        user.setPasswordHash("hash");
        user.setRole("employer");
        return user;
    }

    @Test
    void loginIssuesATokenCarryingTheUserIdAndRole() {
        when(users.findByEmail("ada@example.com")).thenReturn(Optional.of(ada()));
        when(passwordEncoder.matches("password1", "hash")).thenReturn(true);
        Jwt signed = Jwt.withTokenValue("signed-token").header("alg", "HS256").subject("u1").build();
        when(jwtEncoder.encode(any(JwtEncoderParameters.class))).thenReturn(signed);

        AuthService.LoginResult result = service.login(new LoginRequest(" ADA@example.com ", "password1"));

        assertThat(result.token()).isEqualTo("signed-token");
        assertThat(result.user().getId()).isEqualTo("u1");

        ArgumentCaptor<JwtEncoderParameters> captor = ArgumentCaptor.forClass(JwtEncoderParameters.class);
        verify(jwtEncoder).encode(captor.capture());
        assertThat(captor.getValue().getClaims().getSubject()).isEqualTo("u1");
        assertThat(captor.getValue().getClaims().getClaimAsString("role")).isEqualTo("employer");
        assertThat(captor.getValue().getClaims().getExpiresAt()).isAfter(captor.getValue().getClaims().getIssuedAt());
    }

    @Test
    void wrongPasswordIsRejected() {
        when(users.findByEmail("ada@example.com")).thenReturn(Optional.of(ada()));
        when(passwordEncoder.matches("wrong-password", "hash")).thenReturn(false);

        assertApiError(() -> service.login(new LoginRequest("ada@example.com", "wrong-password")),
            HttpStatus.UNAUTHORIZED, "Invalid email or password.");
        verify(jwtEncoder, never()).encode(any(JwtEncoderParameters.class));
    }

    @Test
    void unknownEmailIsRejectedWithTheSameMessage() {
        when(users.findByEmail("ghost@example.com")).thenReturn(Optional.empty());

        assertApiError(() -> service.login(new LoginRequest("ghost@example.com", "password1")),
            HttpStatus.UNAUTHORIZED, "Invalid email or password.");
    }
}
