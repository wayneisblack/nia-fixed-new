package com.nia.backend.bookmark;

import java.util.List;
import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;

public interface BookmarkRepository extends MongoRepository<Bookmark, String> {
    List<Bookmark> findByUserIdOrderByCreatedAtDesc(String userId);
    Optional<Bookmark> findByUserIdAndOpportunityId(String userId, String opportunityId);
}