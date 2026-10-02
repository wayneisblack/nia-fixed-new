package com.nia.backend.opportunity;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import com.nia.backend.common.ApiException;

@Service
public class OpportunityService {
    private final OpportunityRepository opportunities;

    public OpportunityService(OpportunityRepository opportunities) {
        this.opportunities = opportunities;
    }

    public List<Opportunity> list() {
        return opportunities.findAll();
    }

    public Opportunity get(String id) {
        return opportunities.findById(id)
            .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Opportunity not found."));
    }
}
