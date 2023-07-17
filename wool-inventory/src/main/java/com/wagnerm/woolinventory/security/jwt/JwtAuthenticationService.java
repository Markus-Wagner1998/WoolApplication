package com.wagnerm.woolinventory.security.jwt;

import com.wagnerm.woolinventory.rest.DuplicateUserException;
import com.wagnerm.woolinventory.security.data.UserRepository;
import com.wagnerm.woolinventory.security.data.SignInRequest;
import com.wagnerm.woolinventory.security.data.SignUpRequest;
import com.wagnerm.woolinventory.security.data.User;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class JwtAuthenticationService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public JwtAuthenticationResponse signup(SignUpRequest request) {
        final User user = new User();
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            throw new DuplicateUserException("User already exists");
        }
        userRepository.save(user);
        String jwt = jwtService.generateToken(user);
        return JwtAuthenticationResponse.builder().token(jwt).build();
    }

    public JwtAuthenticationResponse signin(SignInRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));
        User user = userRepository.findByEmail(request.getEmail()).orElseThrow(
                () -> new IllegalArgumentException("Invalid e-mail or password"));
        String jwt = jwtService.generateToken(user);
        return JwtAuthenticationResponse.builder().token(jwt).build();
    }

    public JwtAuthenticationResponse refresh(String userEmail) {
        Optional<User> user = userRepository.findByEmail(userEmail);
        if (user.isPresent()) {
            return JwtAuthenticationResponse.builder().token(jwtService.generateToken(user.get())).build();
        } else {
            throw new IllegalArgumentException("User does not exist in the system");
        }
    }
}
