package com.carfinder.sales.controllers;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174"}, allowCredentials = "true")
public class AuthController {

    @GetMapping("/me")
    public MeResponse me(Authentication auth) {
        String username = auth.getName();
        List<String> roles = auth.getAuthorities()
                .stream().map(GrantedAuthority::getAuthority).toList();
        return new MeResponse(username, roles);
    }

    public record MeResponse(String username, List<String> roles) {}
}
