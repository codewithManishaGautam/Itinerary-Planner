package com.tripplanner.api.service;

import com.tripplanner.api.dto.AuthResponse;
import com.tripplanner.api.dto.LoginRequest;
import com.tripplanner.api.dto.SignupRequest;
import com.tripplanner.api.model.User;
import com.tripplanner.api.security.JwtTokenProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    @Autowired
    private UserService userService;

    @Autowired
    private JwtTokenProvider tokenProvider;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public AuthResponse signup(SignupRequest request) {
        if (userService.emailExists(request.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        User user = userService.createUser(request.getName(), request.getEmail(), request.getPassword());
        return convertToAuthResponse(user, null);
    }

    public AuthResponse login(LoginRequest request) {
        User user = userService.getUserByEmail(request.getEmail())
            .orElseThrow(() -> new RuntimeException("Invalid email or password"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid email or password");
        }

        String token = tokenProvider.generateToken(user.getId());
        return convertToAuthResponse(user, token);
    }

    private AuthResponse convertToAuthResponse(User user, String token) {
        return new AuthResponse(user.getId(), user.getName(), user.getEmail(), token);
    }
}
