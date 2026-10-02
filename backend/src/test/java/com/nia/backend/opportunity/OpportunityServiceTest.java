package com.nia.backend.opportunity;

import static com.nia.backend.support.ApiAssertions.assertApiError;
import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.when;

import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.mockito.junit.jupiter.MockitoSettings;
import org.mockito.quality.Strictness;
import org.springframework.http.HttpStatus;

@ExtendWith(MockitoExtension.class)
@MockitoSettings(strictness = Strictness.LENIENT)
class OpportunityServiceTest {
    @Mock OpportunityRepository opportunities;
    @InjectMocks OpportunityService service;

    private Opportunity opportunity(String id) {
        Opportunity opportunity = new Opportunity();
        opportunity.setId(id);
        opportunity.setTitle("Title " + id);
        return opportunity;
    }

    @Test
    void listReturnsEverything() {
        when(opportunities.findAll()).thenReturn(List.of(opportunity("a"), opportunity("b")));

        assertThat(service.list()).hasSize(2);
    }

    @Test
    void getReturnsTheMatchingOpportunity() {
        Opportunity found = opportunity("a");
        when(opportunities.findById("a")).thenReturn(Optional.of(found));

        assertThat(service.get("a")).isSameAs(found);
    }

    @Test
    void getUnknownIdIs404() {
        when(opportunities.findById("missing")).thenReturn(Optional.empty());

        assertApiError(() -> service.get("missing"), HttpStatus.NOT_FOUND, "Opportunity not found.");
    }
}
