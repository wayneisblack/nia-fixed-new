package com.nia.backend.auth;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import com.nia.backend.common.ApiException;
import com.nia.backend.common.GlobalExceptionHandler;
import com.nia.backend.user.User;

class AuthControllerTest {
    private final AuthService authService = mock(AuthService.class);
    private MockMvc mvc;

    @BeforeEach
    void setUp() {
        mvc = MockMvcBuilders.standaloneSetup(new AuthController(authService))
            .setControllerAdvice(new GlobalExceptionHandler())
            .build();
    }

    @Test
    void loginReturnsTokenAndUser() throws Exception {
        User user = new User();
        user.setId("u1");
        user.setName("Ada");
        user.setEmail("ada@example.com");
        user.setRole("talent");
        user.setPasswordHash("secret-hash");
        when(authService.login(any(LoginRequest.class))).thenReturn(new AuthService.LoginResult("tok", user));

        mvc.perform(post("/api/auth/login").contentType(MediaType.APPLICATION_JSON)
                .content("{\"email\":\"ada@example.com\",\"password\":\"password1\"}"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.data.token").value("tok"))
            .andExpect(jsonPath("$.data.user.email").value("ada@example.com"))
            .andExpect(jsonPath("$.data.user.passwordHash").doesNotExist());
    }

    @Test
    void badCredentialsReturn401WithErrorMessage() throws Exception {
        when(authService.login(any(LoginRequest.class)))
            .thenThrow(new ApiException(HttpStatus.UNAUTHORIZED, "Invalid email or password."));

        mvc.perform(post("/api/auth/login").contentType(MediaType.APPLICATION_JSON)
                .content("{\"email\":\"ada@example.com\",\"password\":\"nope-nope\"}"))
            .andExpect(status().isUnauthorized())
            .andExpect(jsonPath("$.error").value("Invalid email or password."));
    }

    @Test
    void blankPasswordIsRejectedBeforeReachingTheService() throws Exception {
        mvc.perform(post("/api/auth/login").contentType(MediaType.APPLICATION_JSON)
                .content("{\"email\":\"ada@example.com\",\"password\":\"\"}"))
            .andExpect(status().isBadRequest())
            .andExpect(jsonPath("$.error").exists());
    }
}
