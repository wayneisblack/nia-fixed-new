package com.nia.backend.account;

import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import com.nia.backend.common.ApiException;
import com.nia.backend.common.GlobalExceptionHandler;
import com.nia.backend.support.JwtPrincipalResolver;

class AccountControllerTest {
    private final AccountService accountService = mock(AccountService.class);
    private MockMvc mvc;

    @BeforeEach
    void setUp() {
        mvc = MockMvcBuilders.standaloneSetup(new AccountController(accountService))
            .setCustomArgumentResolvers(new JwtPrincipalResolver("u1"))
            .setControllerAdvice(new GlobalExceptionHandler())
            .build();
    }

    @Test
    void deleteRemovesTheLoggedInUsersAccount() throws Exception {
        mvc.perform(delete("/api/account"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.data.ok").value(true));

        verify(accountService).delete("u1");
    }

    @Test
    void changeEmailReturnsTheNewAddress() throws Exception {
        when(accountService.changeEmail("u1", "new@example.com")).thenReturn("new@example.com");

        mvc.perform(patch("/api/account/email").contentType(MediaType.APPLICATION_JSON).content("{\"email\":\"new@example.com\"}"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.data.email").value("new@example.com"))
            .andExpect(jsonPath("$.data.emailVerified").value(false));
    }

    @Test
    void emailInUseReturns409() throws Exception {
        when(accountService.changeEmail("u1", "taken@example.com"))
            .thenThrow(new ApiException(HttpStatus.CONFLICT, "That email is already in use."));

        mvc.perform(patch("/api/account/email").contentType(MediaType.APPLICATION_JSON).content("{\"email\":\"taken@example.com\"}"))
            .andExpect(status().isConflict())
            .andExpect(jsonPath("$.error").value("That email is already in use."));
    }

    @Test
    void changePasswordSucceeds() throws Exception {
        mvc.perform(patch("/api/account/password").contentType(MediaType.APPLICATION_JSON)
                .content("{\"currentPassword\":\"current-pass\",\"newPassword\":\"brand-new-pass\"}"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.data.ok").value(true));

        verify(accountService).changePassword("u1", "current-pass", "brand-new-pass");
    }

    @Test
    void wrongCurrentPasswordReturns400() throws Exception {
        doThrow(new ApiException(HttpStatus.BAD_REQUEST, "Current password is incorrect."))
            .when(accountService).changePassword("u1", "wrong", "brand-new-pass");

        mvc.perform(patch("/api/account/password").contentType(MediaType.APPLICATION_JSON)
                .content("{\"currentPassword\":\"wrong\",\"newPassword\":\"brand-new-pass\"}"))
            .andExpect(status().isBadRequest())
            .andExpect(jsonPath("$.error").value("Current password is incorrect."));
    }
}
