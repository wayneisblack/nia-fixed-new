package com.nia.backend.health;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import java.util.Map;

import org.junit.jupiter.api.Test;
import org.springframework.data.mongodb.core.MongoTemplate;

import com.mongodb.client.MongoDatabase;

class HealthServiceTest {
    private final MongoTemplate mongo = mock(MongoTemplate.class);
    private final HealthService service = new HealthService(mongo);

    @Test
    void reportsConnectedWhenMongoAnswersThePing() {
        when(mongo.getDb()).thenReturn(mock(MongoDatabase.class));

        Map<String, Object> status = service.status();

        assertThat(status).containsEntry("status", "ok").containsEntry("app", "nia").containsEntry("database", "connected");
        assertThat(status).containsKey("timestamp");
        assertThat(status).doesNotContainKey("databaseError");
    }

    @Test
    void stillAnswersButReportsAnErrorWhenMongoIsDown() {
        when(mongo.getDb()).thenThrow(new IllegalStateException("cluster unreachable"));

        Map<String, Object> status = service.status();

        assertThat(status).containsEntry("status", "ok").containsEntry("database", "error");
        assertThat(status).containsEntry("databaseError", "cluster unreachable");
    }
}
