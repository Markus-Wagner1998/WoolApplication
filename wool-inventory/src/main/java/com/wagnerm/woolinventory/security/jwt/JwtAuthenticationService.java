package com.wagnerm.woolinventory.security.jwt;

import com.wagnerm.woolinventory.rest.exceptions.DuplicateUserException;
import com.wagnerm.woolinventory.security.data.SignInRequest;
import com.wagnerm.woolinventory.security.data.SignUpRequest;
import com.wagnerm.woolinventory.security.data.User;
import com.wagnerm.woolinventory.security.data.UserRepository;
import com.wagnerm.woolinventory.service.data.UpdateUserDTO;
import com.wagnerm.woolinventory.service.data.UserDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

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
        User user = userRepository.findByEmail(userEmail).orElseThrow(
                () -> new IllegalArgumentException("User does not exist in the system"));
        return JwtAuthenticationResponse
                .builder()
                .token(
                        jwtService.generateToken(user)
                ).build();
    }

    public UserDTO updateUser(String userEmail, UpdateUserDTO updateUser) {
        if (!userEmail.equalsIgnoreCase(updateUser.getEmail())) {
            throw new UsernameNotFoundException("User authentication does not match provided user object");
        }
        User dbUser = this.userRepository.findByEmail(userEmail).orElseThrow(() -> new UsernameNotFoundException(
                "User with id %s could not be found.".formatted(userEmail)));
        updateUser.setId(dbUser.getId());
        if (updateUser.getPassword().isEmpty()) {
            updateUser.setPassword(dbUser.getPassword());
        } else {
            updateUser.setPassword(passwordEncoder.encode(updateUser.getPassword()));
        }
        return new UserDTO(this.userRepository.save(updateUser.toUser()));
    }

    public UserDTO getUserByEmail(String userEmail) {
        return new UserDTO(
                this.userRepository.findByEmail(userEmail).orElseThrow(() -> new UsernameNotFoundException(
                        "User with email %s could not be found.".formatted(userEmail)))
        );
    }

}
