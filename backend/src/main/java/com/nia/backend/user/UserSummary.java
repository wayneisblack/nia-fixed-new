package com.nia.backend.user;

/** The safe, public view of a user (never includes the password hash). */
public record UserSummary(String id, String name, String email, String role) {
    public static UserSummary from(User user) {
        String role = user.getRole() == null ? "talent" : user.getRole();
        return new UserSummary(user.getId(), user.getName(), user.getEmail(), role);
    }
}
