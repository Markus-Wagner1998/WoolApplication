package com.wagnerm.woolinventory.security.jwt;

import com.wagnerm.woolinventory.rest.exceptions.DuplicateUserException;
import com.wagnerm.woolinventory.security.data.SignInRequest;
import com.wagnerm.woolinventory.security.data.SignUpRequest;
import com.wagnerm.woolinventory.security.data.User;
import com.wagnerm.woolinventory.security.data.UserRepository;
import com.wagnerm.woolinventory.service.data.PasswordResetDTO;
import com.wagnerm.woolinventory.service.data.UpdateUserDTO;
import com.wagnerm.woolinventory.service.data.UserDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.MailSender;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class JwtAuthenticationService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final MailSender mailSender;
    @Value("${sending.mail.username}")
    private String mailSenderEmail;
    @Value("${application.base.url}")
    private String applicaitonBaseUrl;

    public JwtAuthenticationResponse signup(SignUpRequest request) {
        final User user = new User();
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setActive(false);
        user.setHash(getRandomString());
        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            throw new DuplicateUserException("User already exists");
        }
        userRepository.save(user);
        sendMail(user.getEmail(), "Account bestätigen", getUserActivationUrl(user));
        String jwt = jwtService.generateToken(user);
        return JwtAuthenticationResponse.builder().token(jwt).build();
    }

    public JwtAuthenticationResponse signin(SignInRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));
        User user = userRepository.findByEmailAndActive(request.getEmail(), true).orElseThrow(
                () -> new IllegalArgumentException("Invalid e-mail or password"));
        String jwt = jwtService.generateToken(user);
        return JwtAuthenticationResponse.builder().token(jwt).build();
    }

    public JwtAuthenticationResponse activate(String hash) {
        User user = userRepository.findByHash(hash).orElseThrow(
                () -> new IllegalArgumentException("User hash invalid"));
        user.setActive(true);
        user.setHash("");
        userRepository.save(user);
        String jwt = jwtService.generateToken(user);
        return JwtAuthenticationResponse.builder().token(jwt).build();
    }

    public JwtAuthenticationResponse refresh(String userEmail) {
        User user = userRepository.findByEmailAndActive(userEmail, true).orElseThrow(
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
        User dbUser = this.userRepository.findByEmailAndActive(userEmail, true).orElseThrow(() -> new UsernameNotFoundException(
                "User with id %s could not be found.".formatted(userEmail)));
        updateUser.setId(dbUser.getId());
        if (updateUser.getPassword().isEmpty()) {
            updateUser.setPassword(dbUser.getPassword());
        } else {
            updateUser.setPassword(passwordEncoder.encode(updateUser.getPassword()));
        }
        return new UserDTO(this.userRepository.save(updateUser.toUser()));
    }

    public void preparePasswordReset(String userEmail) {
        User user = this.userRepository.findByEmailAndActive(userEmail, true).orElseThrow(() -> new UsernameNotFoundException(
                "User with id %s could not be found.".formatted(userEmail)));
        user.setHash(this.getRandomString());
        user = userRepository.save(user);
        sendMail(user.getEmail(), "Passwort zurücksetzen", getPasswordResetUrl(user));
    }

    public void resetUserPassword(String userHash, PasswordResetDTO passwordResetDTO) {
        User user = userRepository.findByHash(userHash).orElseThrow(
                () -> new IllegalArgumentException("User hash invalid"));
        user.setActive(true);
        user.setHash("");
        user.setPassword(passwordEncoder.encode(passwordResetDTO.getPassword()));
        userRepository.save(user);
    }

    public UserDTO getUserByEmail(String userEmail) {
        return new UserDTO(
                this.userRepository.findByEmailAndActive(userEmail, true).orElseThrow(() -> new UsernameNotFoundException(
                        "User with email %s could not be found.".formatted(userEmail)))
        );
    }

    private String getRandomString() {
        UUID uuid = UUID.randomUUID();
        return uuid.toString();
    }

    private String getUserActivationUrl(User user) {
        if (!applicaitonBaseUrl.endsWith("/")) {
            applicaitonBaseUrl = applicaitonBaseUrl + "/";
        }
        return applicaitonBaseUrl + "activate?hash=" + user.getHash();
    }

    private String getPasswordResetUrl(User user) {
        if (!applicaitonBaseUrl.endsWith("/")) {
            applicaitonBaseUrl = applicaitonBaseUrl + "/";
        }
        return applicaitonBaseUrl + "resetPasswordHash?hash=" + user.getHash();
    }

    private void sendMail(String toEmail, String subject, String content) {
        SimpleMailMessage simpleMailMessage = new SimpleMailMessage();
        simpleMailMessage.setFrom(mailSenderEmail);
        simpleMailMessage.setTo(toEmail);
        simpleMailMessage.setSubject(subject);
        simpleMailMessage.setText(content);
        mailSender.send(simpleMailMessage);
    }

}
