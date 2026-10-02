package com.nia.backend.bookmark;

import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.List;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import com.nia.backend.common.ApiException;
import com.nia.backend.common.GlobalExceptionHandler;
import com.nia.backend.support.JwtPrincipalResolver;

class BookmarkControllerTest {
    private final BookmarkService bookmarkService = mock(BookmarkService.class);
    private MockMvc mvc;

    @BeforeEach
    void setUp() {
        mvc = MockMvcBuilders.standaloneSetup(new BookmarkController(bookmarkService))
            .setCustomArgumentResolvers(new JwtPrincipalResolver("u1"))
            .setControllerAdvice(new GlobalExceptionHandler())
            .build();
    }

    @Test
    void toggleReportsWhetherItIsNowSaved() throws Exception {
        when(bookmarkService.toggle("u1", "opp-1")).thenReturn(true);

        mvc.perform(post("/api/bookmarks").contentType(MediaType.APPLICATION_JSON).content("{\"opportunityId\":\"opp-1\"}"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.data.opportunityId").value("opp-1"))
            .andExpect(jsonPath("$.data.saved").value(true));
    }

    @Test
    void missingOpportunityIdReturns400() throws Exception {
        when(bookmarkService.toggle("u1", ""))
            .thenThrow(new ApiException(HttpStatus.BAD_REQUEST, "opportunityId is required."));

        mvc.perform(post("/api/bookmarks").contentType(MediaType.APPLICATION_JSON).content("{}"))
            .andExpect(status().isBadRequest())
            .andExpect(jsonPath("$.error").value("opportunityId is required."));
    }

    @Test
    void listReturnsBookmarks() throws Exception {
        Bookmark bookmark = new Bookmark();
        bookmark.setId("b1");
        bookmark.setOpportunityId("opp-1");
        when(bookmarkService.list("u1")).thenReturn(List.of(bookmark));

        mvc.perform(get("/api/bookmarks"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.data[0].opportunityId").value("opp-1"));
    }
}
