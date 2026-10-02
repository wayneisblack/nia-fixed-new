package com.nia.backend.application;

import java.util.List;
import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;

public interface ApplicationRepository extends MongoRepository<Application, String> {
    List<Application> findByUserIdOrderByCreatedAtDesc(String userId);
    Optional<Application> findByUserIdAndOpportunityIdAndStatus(String userId, String opportunityId, String status);
    Optional<Application> findByIdAndUserId(String id, String userId);
}