package com.nia.backend.profile;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;

import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import com.nia.backend.common.ApiException;
import com.nia.backend.user.UserQueries;
import com.nia.backend.user.UserRepository;

@Service
public class ProfileService {
    private static final String BAD_LOCATION = "Location must include a valid country and city.";

    private final MongoTemplate mongo;
    private final UserRepository users;

    public ProfileService(MongoTemplate mongo, UserRepository users) {
        this.mongo = mongo;
        this.users = users;
    }

    /** Applies only the fields present in the request and returns what was saved. */
    public Map<String, Object> update(String userId, Map<String, Object> body) {
        if (users.findById(userId).isEmpty()) {
            throw new ApiException(HttpStatus.UNAUTHORIZED, "Your session expired. Please sign in again.");
        }

        Update update = new Update();
        Map<String, Object> saved = new LinkedHashMap<>();

        if (body.get("categories") instanceof List<?> values) {
            List<String> categories = strings(values, 100, 100);
            set(update, saved, "categories", categories);
        }
        if (body.get("skills") instanceof List<?> values) {
            List<String> skills = new ArrayList<>(new LinkedHashSet<>(strings(values, 60, 30)));
            set(update, saved, "skills", skills);
        }
        if (body.containsKey("location")) {
            if (!(body.get("location") instanceof Map<?, ?> raw)) throw new ApiException(HttpStatus.BAD_REQUEST, BAD_LOCATION);
            String country = text(raw.get("country"));
            String region = text(raw.get("region"));
            String city = text(raw.get("city"));
            if (country.isBlank() || city.isBlank() || city.length() > 100) throw new ApiException(HttpStatus.BAD_REQUEST, BAD_LOCATION);
            set(update, saved, "location", Map.of("country", country, "region", region, "city", city));
        }
        textField(body, update, saved, "about", 2000);
        textField(body, update, saved, "website", 200);
        textField(body, update, saved, "industry", 100);
        textField(body, update, saved, "companySize", 40);
        if (body.containsKey("phone")) {
            Object phone = body.get("phone");
            if (phone == null) {
                set(update, saved, "phone", null);
            } else if (phone instanceof Map<?, ?> raw) {
                set(update, saved, "phone", Map.of("dialCode", text(raw.get("dialCode")), "number", text(raw.get("number"))));
            } else {
                throw new ApiException(HttpStatus.BAD_REQUEST, "Enter a valid phone number and country code.");
            }
        }
        if (body.get("experience") instanceof List<?> experience) set(update, saved, "experience", experience);
        if (body.get("education") instanceof List<?> education) set(update, saved, "education", education);
        if (body.get("preferences") instanceof Map<?, ?> preferences) set(update, saved, "preferences", preferences);
        if (body.get("onboardingStep") instanceof String step) set(update, saved, "onboardingStep", step);
        if (body.get("onboardingComplete") instanceof Boolean complete) set(update, saved, "onboardingComplete", complete);

        if (saved.isEmpty()) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "Nothing to update.");
        }
        mongo.updateFirst(UserQueries.byId(userId), update, "users");
        return saved;
    }

    private void set(Update update, Map<String, Object> saved, String field, Object value) {
        update.set(field, value);
        saved.put(field, value);
    }

    private void textField(Map<String, Object> body, Update update, Map<String, Object> saved, String field, int maxLength) {
        if (body.get(field) instanceof String value) {
            String trimmed = value.trim();
            set(update, saved, field, trimmed.substring(0, Math.min(trimmed.length(), maxLength)));
        }
    }

    private List<String> strings(List<?> values, int maxLength, int maxCount) {
        return values.stream().filter(String.class::isInstance).map(value -> ((String) value).trim())
            .filter(value -> !value.isBlank() && value.length() <= maxLength).distinct().limit(maxCount).toList();
    }

    private String text(Object value) {
        return value instanceof String string ? string.trim() : "";
    }
}
