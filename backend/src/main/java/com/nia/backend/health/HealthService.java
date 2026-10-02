package com.nia.backend.health;

import java.time.Instant;
import java.util.LinkedHashMap;
import java.util.Map;

import org.bson.Document;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.stereotype.Service;

@Service
public class HealthService {
    private final MongoTemplate mongo;

    public HealthService(MongoTemplate mongo) {
        this.mongo = mongo;
    }

    public Map<String, Object> status() {
        Map<String, Object> response = new LinkedHashMap<>();
        response.put("status", "ok");
        response.put("app", "nia");
        try {
            mongo.getDb().runCommand(new Document("ping", 1));
            response.put("database", "connected");
        } catch (Exception exception) {
            response.put("database", "error");
            response.put("databaseError", exception.getMessage());
        }
        response.put("timestamp", Instant.now().toString());
        return response;
    }
}
