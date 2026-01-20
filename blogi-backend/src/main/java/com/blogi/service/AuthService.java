package com.blogi.service;

import com.blogi.dto.AuthRequest;
import com.blogi.dto.AuthResponse;
import com.blogi.dto.LoginRequest;
import com.blogi.entity.User;
import com.blogi.exception.BadRequestException;
import com.blogi.repository.UserRepository;
import com.blogi.security.JwtService;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authManager;

    public AuthService(UserRepository userRepository,
                       PasswordEncoder passwordEncoder,
                       JwtService jwtService,
                       AuthenticationManager authManager) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.authManager = authManager;
    }

    public AuthResponse register(AuthRequest req) {
        if (userRepository.existsByUsername(req.getUsername()))
            throw new BadRequestException("Username already exists");
        if (req.getEmail() != null && userRepository.existsByEmail(req.getEmail()))
            throw new BadRequestException("Email already exists");

        User u = new User(req.getUsername(),
                          req.getEmail() == null ? "" : req.getEmail(),
                          passwordEncoder.encode(req.getPassword()));
        u.getRoles().add("USER");
        userRepository.save(u);

        String token = jwtService.generateToken(u.getUsername());
        return new AuthResponse(token, u.getUsername());
    }

    public AuthResponse login(LoginRequest req) {
        try {
            authManager.authenticate(
                new UsernamePasswordAuthenticationToken(req.getUsername(), req.getPassword())
            );
        } catch (AuthenticationException e) {
            throw new BadRequestException("Invalid credentials");
        }
        String token = jwtService.generateToken(req.getUsername());
        return new AuthResponse(token, req.getUsername());
    }
}