package com.wagnerm.woolinventory.rest;

import com.wagnerm.woolinventory.security.data.SignInRequest;
import com.wagnerm.woolinventory.security.data.SignUpRequest;
import com.wagnerm.woolinventory.security.jwt.JwtAuthenticationResponse;
import com.wagnerm.woolinventory.security.jwt.JwtAuthenticationService;
import com.wagnerm.woolinventory.security.jwt.JwtService;
import com.wagnerm.woolinventory.service.data.PasswordResetDTO;
import com.wagnerm.woolinventory.service.data.UserEmailDTO;
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

    @GetMapping("/activate/{userHash}")
    public ResponseEntity<JwtAuthenticationResponse> activate(@PathVariable(name = "userHash") String userHash) {
        return ResponseEntity.ok(jwtAuthenticationService.activate(userHash));
    }

    @PutMapping("/resetPassword/{userHash}")
    public void resetUserPassword(@PathVariable(name = "userHash") String userHash,
                                                                       @RequestBody PasswordResetDTO passwordResetDTO) {
        jwtAuthenticationService.resetUserPassword(userHash, passwordResetDTO);
    }

    @PutMapping("/preparePasswordReset")
    public void preparePasswordReset(@RequestBody UserEmailDTO userEmailDTO) {
        jwtAuthenticationService.preparePasswordReset(userEmailDTO.getEmail());
    }

    @GetMapping("/refresh")
    public ResponseEntity<JwtAuthenticationResponse> refreshToken(@RequestHeader("Authorization") String authHeader) {
        return ResponseEntity.ok(jwtAuthenticationService.refresh(jwtService.extractUserNameFromAuthHeader(authHeader)));
    }
}
