package com.nia.backend.support;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.fail;

import org.springframework.http.HttpStatus;

import com.nia.backend.common.ApiException;

public final class ApiAssertions {
    private ApiAssertions() {}

    @FunctionalInterface
    public interface Call {
        void run() throws Exception;
    }

    /** Asserts that the call throws an ApiException with the given status and message. */
    public static void assertApiError(Call call, HttpStatus status, String message) {
        try {
            call.run();
        } catch (ApiException exception) {
            assertThat(exception.getStatus()).isEqualTo(status);
            assertThat(exception.getMessage()).isEqualTo(message);
            return;
        } catch (Exception other) {
            fail("Expected ApiException but got " + other);
            return;
        }
        fail("Expected ApiException with status " + status + " but nothing was thrown");
    }
}
