package com.nia.backend.profile;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.Map;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import com.nia.backend.common.ApiException;
import com.nia.backend.common.GlobalExceptionHandler;
import com.nia.backend.support.JwtPrincipalResolver;

class ProfileControllerTest {
    private final ProfileService profileService = mock(ProfileService.class);
    private MockMvc mvc;

    @BeforeEach
    void setUp() {
        mvc = MockMvcBuilders.standaloneSetup(new ProfileController(profileService))
            .setCustomArgumentResolvers(new JwtPrincipalResolver("u1"))
            .setControllerAdvice(new GlobalExceptionHandler())
            .build();
    }

    @Test
    void patchPassesTheLoggedInUserIdAndReturnsWhatWasSaved() throws Exception {
        when(profileService.update(eq("u1"), any())).thenReturn(Map.of("about", "Hello"));

        mvc.perform(patch("/api/profile").contentType(MediaType.APPLICATION_JSON).content("{\"about\":\"Hello\"}"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.data.about").value("Hello"));
    }

    @Test
    void serviceErrorsBecomeJsonErrors() throws Exception {
        when(profileService.update(eq("u1"), any()))
            .thenThrow(new ApiException(HttpStatus.BAD_REQUEST, "Nothing to update."));

        mvc.perform(patch("/api/profile").contentType(MediaType.APPLICATION_JSON).content("{}"))
            .andExpect(status().isBadRequest())
            .andExpect(jsonPath("$.error").value("Nothing to update."));
    }
}
