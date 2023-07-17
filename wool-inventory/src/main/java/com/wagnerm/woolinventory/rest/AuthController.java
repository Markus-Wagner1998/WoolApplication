package com.wagnerm.woolinventory.rest;

import com.wagnerm.woolinventory.security.data.SignInRequest;
import com.wagnerm.woolinventory.security.data.SignUpRequest;
import com.wagnerm.woolinventory.security.jwt.JwtAuthenticationResponse;
import com.wagnerm.woolinventory.security.jwt.JwtAuthenticationService;
import com.wagnerm.woolinventory.security.jwt.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {
    private final JwtAuthenticationService jwtAuthenticationService;
    private final JwtService jwtService;

    @PostMapping("/signup")
    public ResponseEntity<JwtAuthenticationResponse> signup(@RequestBody SignUpRequest request) {
        return ResponseEntity.ok(jwtAuthenticationService.signup(request));
    }

    @PostMapping("/signin")
    public ResponseEntity<JwtAuthenticationResponse> signin(@RequestBody SignInRequest request) {
        return ResponseEntity.ok(jwtAuthenticationService.signin(request));
    }

    @GetMapping("/refresh")
    public ResponseEntity<JwtAuthenticationResponse> refreshToken(@RequestHeader("Authorization") String authHeader) {
        return ResponseEntity.ok(jwtAuthenticationService.refresh(jwtService.extractUserNameFromAuthHeader(authHeader)));
    }
}
