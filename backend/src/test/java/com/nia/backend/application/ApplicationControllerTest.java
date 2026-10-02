package com.nia.backend.application;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.List;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import com.nia.backend.common.ApiException;
import com.nia.backend.common.GlobalExceptionHandler;
import com.nia.backend.support.JwtPrincipalResolver;

class ApplicationControllerTest {
    private final ApplicationService applicationService = mock(ApplicationService.class);
    private MockMvc mvc;

    @BeforeEach
    void setUp() {
        mvc = MockMvcBuilders.standaloneSetup(new ApplicationController(applicationService))
            .setCustomArgumentResolvers(new JwtPrincipalResolver("u1"))
            .setControllerAdvice(new GlobalExceptionHandler())
            .build();
    }

    private Application application(String id, String status) {
        Application application = new Application();
        application.setId(id);
        application.setUserId("u1");
        application.setStatus(status);
        return application;
    }

    @Test
    void listReturnsDataAndCount() throws Exception {
        when(applicationService.list("u1")).thenReturn(List.of(application("a1", "Active"), application("a2", "Cancelled")));

        mvc.perform(get("/api/applications"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.count").value(2))
            .andExpect(jsonPath("$.data[0].id").value("a1"));
    }

    @Test
    void createReturns201WithMessage() throws Exception {
        when(applicationService.create(eq("u1"), any())).thenReturn(application("a1", "Active"));

        mvc.perform(post("/api/applications").contentType(MediaType.APPLICATION_JSON)
                .content("{\"fullName\":\"Ada\",\"email\":\"ada@example.com\",\"motivation\":\"Hi\"}"))
            .andExpect(status().isCreated())
            .andExpect(jsonPath("$.message").value("Application submitted successfully."))
            .andExpect(jsonPath("$.data.status").value("Active"));
    }

    @Test
    void duplicateApplicationReturns409() throws Exception {
        when(applicationService.create(eq("u1"), any()))
            .thenThrow(new ApiException(HttpStatus.CONFLICT, "You've already applied to this opportunity."));

        mvc.perform(post("/api/applications").contentType(MediaType.APPLICATION_JSON).content("{}"))
            .andExpect(status().isConflict())
            .andExpect(jsonPath("$.error").value("You've already applied to this opportunity."));
    }

    @Test
    void cancelReturnsTheCancelledApplication() throws Exception {
        when(applicationService.cancel("u1", "a1")).thenReturn(application("a1", "Cancelled"));

        mvc.perform(post("/api/applications/a1/cancel"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.message").value("Application cancelled."))
            .andExpect(jsonPath("$.data.status").value("Cancelled"));
    }

    @Test
    void cancellingAnUnknownApplicationReturns404() throws Exception {
        when(applicationService.cancel("u1", "nope"))
            .thenThrow(new ApiException(HttpStatus.NOT_FOUND, "Application not found."));

        mvc.perform(post("/api/applications/nope/cancel"))
            .andExpect(status().isNotFound())
            .andExpect(jsonPath("$.error").value("Application not found."));
    }
}
