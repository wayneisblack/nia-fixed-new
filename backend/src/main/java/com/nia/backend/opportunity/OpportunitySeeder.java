package com.nia.backend.opportunity;

import java.util.List;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class OpportunitySeeder implements CommandLineRunner {
    private final OpportunityRepository opportunities;

    public OpportunitySeeder(OpportunityRepository opportunities) {
        this.opportunities = opportunities;
    }

    @Override
    public void run(String... args) {
        if (opportunities.count() > 0) return;

        opportunities.saveAll(List.of(
            opportunity("frontend-developer-intern", "Frontend Developer Intern", "TechNova", "Lagos, Nigeria", "Internship", "Engineering", true, "September 15, 2026", "TechNova is looking for a passionate frontend developer intern to join our product team and help build beautiful, accessible digital experiences."),
            opportunity("product-design-fellowship", "Product Design Fellowship", "Design Africa", "Remote", "Fellowship", "UI/UX", true, "September 22, 2026", "A fellowship designed for emerging African product designers who want to develop their skills while working on real-world products."),
            opportunity("junior-software-engineer", "Junior Software Engineer", "AfriLabs", "Lagos, Nigeria", "Job", "Engineering", false, "October 3, 2026", "Join a growing engineering team building technology products for users across Africa."),
            opportunity("african-innovation-scholarship", "African Innovation Scholarship", "Future Africa", "Africa", "Scholarship", "Research & Innovation", true, "October 10, 2026", "A scholarship opportunity supporting young Africans working on innovative ideas that can create meaningful impact.")
        ));
    }

    private Opportunity opportunity(String id, String title, String organization, String location, String type, String category, boolean remote, String deadline, String description) {
        Opportunity opportunity = new Opportunity();
        opportunity.setId(id);
        opportunity.setTitle(title);
        opportunity.setOrganization(organization);
        opportunity.setLocation(location);
        opportunity.setType(type);
        opportunity.setCategory(category);
        opportunity.setRemote(remote);
        opportunity.setDeadline(deadline);
        opportunity.setDescription(description);
        opportunity.setResponsibilities(List.of());
        opportunity.setRequirements(List.of());
        return opportunity;
    }
}