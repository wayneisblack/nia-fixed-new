package com.nia.backend.support;

import org.springframework.core.MethodParameter;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.support.WebDataBinderFactory;
import org.springframework.web.context.request.NativeWebRequest;
import org.springframework.web.method.support.HandlerMethodArgumentResolver;
import org.springframework.web.method.support.ModelAndViewContainer;

/** Lets standalone MockMvc tests act as a logged-in user for @AuthenticationPrincipal Jwt parameters. */
public class JwtPrincipalResolver implements HandlerMethodArgumentResolver {
    private final Jwt jwt;

    public JwtPrincipalResolver(String userId) {
        this.jwt = Jwt.withTokenValue("test-token").header("alg", "HS256").subject(userId).build();
    }

    @Override
    public boolean supportsParameter(MethodParameter parameter) {
        return Jwt.class.isAssignableFrom(parameter.getParameterType());
    }

    @Override
    public Object resolveArgument(MethodParameter parameter, ModelAndViewContainer mavContainer,
            NativeWebRequest webRequest, WebDataBinderFactory binderFactory) {
        return jwt;
    }
}
