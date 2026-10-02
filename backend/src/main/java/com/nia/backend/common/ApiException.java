package com.nia.backend.common;

import org.springframework.http.HttpStatus;

/** Thrown by services when a request can't be completed; mapped to a JSON error by GlobalExceptionHandler. */
public class ApiException extends RuntimeException {
    private final HttpStatus status;

    public ApiException(HttpStatus status, String message) {
        super(message);
        this.status = status;
    }

    public HttpStatus getStatus() {
        return status;
    }
}
