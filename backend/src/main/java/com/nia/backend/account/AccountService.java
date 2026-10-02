package com.nia.backend.account;

import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.nia.backend.common.ApiException;
import com.nia.backend.user.User;
import com.nia.backend.user.UserQueries;
import com.nia.backend.user.UserRepository;

@Service
public class AccountService {
    private static final String SESSION_EXPIRED = "Your session expired. Please sign in again.";

    private final MongoTemplate mongo;
    private final UserRepository users;
    private final PasswordEncoder passwordEncoder;

    public AccountService(MongoTemplate mongo, UserRepository users, PasswordEncoder passwordEncoder) {
        this.mongo = mongo;
        this.users = users;
        this.passwordEncoder = passwordEncoder;
    }

    /** Removes the user and everything that belongs to them. */
    public void delete(String userId) {
        mongo.remove(UserQueries.byId(userId), "users");
        mongo.remove(Query.query(Criteria.where("userId").is(userId)), "applications");
        mongo.remove(Query.query(Criteria.where("userId").is(userId)), "bookmarks");
    }

    /** Changes the email (which marks it unverified again) and returns the normalised address. */
    public String changeEmail(String userId, String rawEmail) {
        String email = text(rawEmail).toLowerCase();
        if (!email.contains("@")) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "Enter a valid email address.");
        }
        User current = users.findById(userId)
            .orElseThrow(() -> new ApiException(HttpStatus.UNAUTHORIZED, SESSION_EXPIRED));
        if (!email.equals(current.getEmail()) && users.existsByEmail(email)) {
            throw new ApiException(HttpStatus.CONFLICT, "That email is already in use.");
        }
        mongo.updateFirst(UserQueries.byId(userId), new Update().set("email", email).set("emailVerified", false), "users");
        return email;
    }

    public void changePassword(String userId, String rawCurrentPassword, String rawNewPassword) {
        String currentPassword = text(rawCurrentPassword);
        String newPassword = text(rawNewPassword);
        if (newPassword.length() < 8) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "Your new password must be at least 8 characters.");
        }
        User user = users.findById(userId)
            .orElseThrow(() -> new ApiException(HttpStatus.UNAUTHORIZED, SESSION_EXPIRED));
        if (!passwordEncoder.matches(currentPassword, user.getPasswordHash())) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "Current password is incorrect.");
        }
        mongo.updateFirst(UserQueries.byId(userId), new Update().set("passwordHash", passwordEncoder.encode(newPassword)), "users");
    }

    private String text(String value) {
        return value == null ? "" : value.trim();
    }
}
