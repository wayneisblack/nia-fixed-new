package com.nia.backend.health;

import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.Map;

import org.junit.jupiter.api.Test;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

class HealthControllerTest {
    @Test
    void healthEndpointReturnsTheServiceStatus() throws Exception {
        HealthService healthService = mock(HealthService.class);
        when(healthService.status()).thenReturn(Map.of("status", "ok", "app", "nia", "database", "connected"));
        MockMvc mvc = MockMvcBuilders.standaloneSetup(new HealthController(healthService)).build();

        mvc.perform(get("/api/health"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.status").value("ok"))
            .andExpect(jsonPath("$.database").value("connected"));
    }
}
