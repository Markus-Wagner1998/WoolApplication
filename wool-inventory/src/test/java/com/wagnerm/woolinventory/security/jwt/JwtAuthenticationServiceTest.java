package com.wagnerm.woolinventory.security.jwt;

import com.wagnerm.woolinventory.rest.exceptions.DuplicateUserException;
import com.wagnerm.woolinventory.security.data.SignInRequest;
import com.wagnerm.woolinventory.security.data.SignUpRequest;
import com.wagnerm.woolinventory.security.data.User;
import com.wagnerm.woolinventory.security.data.UserRepository;
import com.wagnerm.woolinventory.service.data.UpdateUserDTO;
import com.wagnerm.woolinventory.service.data.UserDTO;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.annotation.DirtiesContext;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
@DirtiesContext(classMode = DirtiesContext.ClassMode.BEFORE_EACH_TEST_METHOD)
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.ANY)
class JwtAuthenticationServiceTest {
    @Autowired
    private JwtAuthenticationService jwtAuthenticationService;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private JwtService jwtService;
    @Autowired
    private PasswordEncoder passwordEncoder;
    private User testUser;

    @BeforeEach
    void setup() {
        testUser = userRepository.save(
                User.builder()
                        .email("test@test.de")
                        .firstName("Markus")
                        .lastName("Wagner")
                        .password(passwordEncoder.encode("password"))
                        .build()
        );
    }

    @Test
    void signup() {
        JwtAuthenticationResponse res = jwtAuthenticationService.signup(
                SignUpRequest.builder()
                        .email("other@other.de")
                        .firstName("Petra")
                        .lastName("Kreuzhuber")
                        .password("password")
                        .build()
        );
        assertThat(res).isNotNull();
        assertThat(res.getToken()).isNotNull();
        assertThat(jwtService.extractUserName(res.getToken())).isEqualTo("other@other.de");
        assertThat(userRepository.findByEmail("other@otherde")).isNotNull();
    }

    @Test
    void signupFailsForDuplicateUser() {
        Assertions.assertThrows(
                DuplicateUserException.class,
                () -> jwtAuthenticationService.signup(
                        SignUpRequest.builder()
                                .email("test@test.de")
                                .firstName("Petra")
                                .lastName("Kreuzhuber")
                                .password("password")
                                .build()
                )
        );
    }

    @Test
    void signin() {
        JwtAuthenticationResponse res = jwtAuthenticationService.signin(
                SignInRequest
                        .builder()
                        .email("test@test.de")
                        .password("password")
                        .build()
        );
        assertThat(res).isNotNull();
        assertThat(res.getToken()).isNotNull();
        assertThat(jwtService.extractUserName(res.getToken())).isEqualTo("test@test.de");
    }

    @Test
    void signinFailsForWrongPassword() {
        Assertions.assertThrows(
                BadCredentialsException.class,
                () -> jwtAuthenticationService.signin(
                        SignInRequest
                                .builder()
                                .email("test@test.de")
                                .password("wrong")
                                .build()
                )
        );
    }

    @Test
    void refresh() {
        JwtAuthenticationResponse res = jwtAuthenticationService.refresh("test@test.de");
        assertThat(res).isNotNull();
        assertThat(res.getToken()).isNotNull();
        assertThat(jwtService.extractUserName(res.getToken())).isEqualTo("test@test.de");
    }

    @Test
    void refreshFailsForNonExistentUser() {
        Assertions.assertThrows(
                IllegalArgumentException.class,
                () -> jwtAuthenticationService.refresh("non@existent.de")
        );
    }

    @Test
    void updateUser() {
        UserDTO updatedUser = jwtAuthenticationService.updateUser(
                "test@test.de",
                new UpdateUserDTO(
                        User.builder()
                                .email("test@test.de")
                                .firstName("Markus2")
                                .lastName("Wagner2")
                                .password("test")
                                .build()
                )
        );
        assertThat(updatedUser).isNotNull();
        assertThat(updatedUser.getId()).isEqualTo(testUser.getId());
        assertThat(updatedUser.getEmail()).isEqualTo(testUser.getEmail());
        assertThat(updatedUser.getFirstName()).isEqualTo("Markus2");
        assertThat(updatedUser.getLastName()).isEqualTo("Wagner2");
    }

    @Test
    void updateUserForOtherUserFails() {
        Assertions.assertThrows(
                UsernameNotFoundException.class,
                () -> jwtAuthenticationService.updateUser(
                        "other@user.de",
                        new UpdateUserDTO(
                                User.builder()
                                        .email("test@test.de")
                                        .firstName("Markus2")
                                        .lastName("Wagner2")
                                        .password("test")
                                        .build()
                        )
                )
        );
    }

    @Test
    void updateUserNonExistentUser() {
        Assertions.assertThrows(
                UsernameNotFoundException.class,
                () -> jwtAuthenticationService.updateUser(
                        "other@user.de",
                        new UpdateUserDTO(
                                User.builder()
                                        .email("other@user.de")
                                        .firstName("Markus2")
                                        .lastName("Wagner2")
                                        .password("test")
                                        .build()
                        )
                )
        );
    }

    @Test
    void getUserByEmail() {
        UserDTO user = jwtAuthenticationService.getUserByEmail("test@test.de");
        assertThat(user).isNotNull();
        assertThat(user.getId()).isEqualTo(testUser.getId());
        assertThat(user.getEmail()).isEqualTo(testUser.getEmail());
        assertThat(user.getFirstName()).isEqualTo(testUser.getFirstName());
        assertThat(user.getLastName()).isEqualTo(testUser.getLastName());
    }

    @Test
    void getUserByEmailFailsForNonExistentUser() {
        Assertions.assertThrows(
                UsernameNotFoundException.class,
                () -> jwtAuthenticationService.getUserByEmail("non-existent@user.de")
        );
    }
}