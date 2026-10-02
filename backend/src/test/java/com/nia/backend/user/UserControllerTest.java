package com.nia.backend.user;

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

class UserControllerTest {
    private final UserService userService = mock(UserService.class);
    private MockMvc mvc;

    @BeforeEach
    void setUp() {
        mvc = MockMvcBuilders.standaloneSetup(new UserController(userService))
            .setControllerAdvice(new GlobalExceptionHandler())
            .build();
    }

    private static final String VALID_BODY =
        "{\"name\":\"Ada\",\"email\":\"ada@example.com\",\"password\":\"password1\",\"role\":\"talent\"}";

    @Test
    void registerReturns201WithThePublicUser() throws Exception {
        User saved = new User();
        saved.setId("u1");
        saved.setName("Ada");
        saved.setEmail("ada@example.com");
        saved.setRole("talent");
        saved.setPasswordHash("secret-hash");
        when(userService.register(any(RegistrationRequest.class))).thenReturn(saved);

        mvc.perform(post("/api/register").contentType(MediaType.APPLICATION_JSON).content(VALID_BODY))
            .andExpect(status().isCreated())
            .andExpect(jsonPath("$.data.id").value("u1"))
            .andExpect(jsonPath("$.data.email").value("ada@example.com"))
            .andExpect(jsonPath("$.data.role").value("talent"))
            .andExpect(jsonPath("$.data.passwordHash").doesNotExist());
    }

    @Test
    void registerWithInvalidEmailReturns400WithErrorMessage() throws Exception {
        mvc.perform(post("/api/register").contentType(MediaType.APPLICATION_JSON)
                .content("{\"name\":\"Ada\",\"email\":\"not-an-email\",\"password\":\"password1\"}"))
            .andExpect(status().isBadRequest())
            .andExpect(jsonPath("$.error").value("Enter a valid email address."));
    }

    @Test
    void registerWithShortPasswordReturns400() throws Exception {
        mvc.perform(post("/api/register").contentType(MediaType.APPLICATION_JSON)
                .content("{\"name\":\"Ada\",\"email\":\"ada@example.com\",\"password\":\"short\"}"))
            .andExpect(status().isBadRequest())
            .andExpect(jsonPath("$.error").value("Your password must be at least 8 characters."));
    }

    @Test
    void registerConflictFromServiceBecomes409() throws Exception {
        when(userService.register(any(RegistrationRequest.class)))
            .thenThrow(new ApiException(HttpStatus.CONFLICT, "An account with this email already exists."));

        mvc.perform(post("/api/register").contentType(MediaType.APPLICATION_JSON).content(VALID_BODY))
            .andExpect(status().isConflict())
            .andExpect(jsonPath("$.error").value("An account with this email already exists."));
    }
}
