package com.nia.backend.opportunity;

import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.List;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import com.nia.backend.common.ApiException;
import com.nia.backend.common.GlobalExceptionHandler;

class OpportunityControllerTest {
    private final OpportunityService opportunityService = mock(OpportunityService.class);
    private MockMvc mvc;

    @BeforeEach
    void setUp() {
        mvc = MockMvcBuilders.standaloneSetup(new OpportunityController(opportunityService))
            .setControllerAdvice(new GlobalExceptionHandler())
            .build();
    }

    private Opportunity opportunity(String id, String title) {
        Opportunity opportunity = new Opportunity();
        opportunity.setId(id);
        opportunity.setTitle(title);
        return opportunity;
    }

    @Test
    void listReturnsDataAndCount() throws Exception {
        when(opportunityService.list()).thenReturn(List.of(opportunity("a", "Intern"), opportunity("b", "Fellow")));

        mvc.perform(get("/api/opportunities"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.count").value(2))
            .andExpect(jsonPath("$.data[1].title").value("Fellow"));
    }

    @Test
    void getByIdReturnsTheOpportunity() throws Exception {
        when(opportunityService.get("a")).thenReturn(opportunity("a", "Intern"));

        mvc.perform(get("/api/opportunities/a"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.data.title").value("Intern"));
    }

    @Test
    void unknownIdReturns404() throws Exception {
        when(opportunityService.get("missing"))
            .thenThrow(new ApiException(HttpStatus.NOT_FOUND, "Opportunity not found."));

        mvc.perform(get("/api/opportunities/missing"))
            .andExpect(status().isNotFound())
            .andExpect(jsonPath("$.error").value("Opportunity not found."));
    }
}
