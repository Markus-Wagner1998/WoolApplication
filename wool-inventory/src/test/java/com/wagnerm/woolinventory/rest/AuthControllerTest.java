package com.wagnerm.woolinventory.rest;

import com.wagnerm.woolinventory.security.data.SignInRequest;
import com.wagnerm.woolinventory.security.data.SignUpRequest;
import com.wagnerm.woolinventory.security.data.User;
import com.wagnerm.woolinventory.security.data.UserRepository;
import com.wagnerm.woolinventory.security.jwt.JwtAuthenticationResponse;
import com.wagnerm.woolinventory.security.jwt.JwtService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.annotation.DirtiesContext;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@DirtiesContext(classMode = DirtiesContext.ClassMode.BEFORE_EACH_TEST_METHOD)
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.ANY)
class AuthControllerTest {
    @Value(value = "${local.server.port}")
    private int port;
    @Autowired
    private TestRestTemplate testRestTemplate;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private JwtService jwtService;
    @Autowired
    private PasswordEncoder passwordEncoder;
    @MockBean
    private JavaMailSender javaMailSender;
    private String authToken;

    @BeforeEach
    void setup() {
        User user = User.builder()
                .firstName("Petra")
                .lastName("Kreuzhuber")
                .email("other@other.de")
                .active(true)
                .password(passwordEncoder.encode("password"))
                .build();
        user = userRepository.save(user);
        authToken = jwtService.generateToken(user);
    }

    @Test
    void signup() {
        ResponseEntity<JwtAuthenticationResponse> response = testRestTemplate.exchange(
                "http://localhost:" + port + "/api/auth/signup", HttpMethod.POST, new HttpEntity<>(SignUpRequest.builder()
                                                                                                           .email("test@test.de")
                                                                                                           .firstName("Markus")
                                                                                                           .lastName("Wagner")
                                                                                                           .password("test")
                                                                                                           .build(), null),
                JwtAuthenticationResponse.class
        );

        assertThat(response.getStatusCode().is2xxSuccessful()).isTrue();
        assertThat(response.hasBody()).isTrue();
        assertThat(jwtService.extractUserName(response.getBody().getToken())).isEqualTo("test@test.de");
    }

    @Test
    void signupFailsForDuplicateUserEmail() {
        ResponseEntity<JwtAuthenticationResponse> response = testRestTemplate.exchange(
                "http://localhost:" + port + "/api/auth/signup", HttpMethod.POST, new HttpEntity<>(SignUpRequest.builder()
                                                                                                           .email("other@other.de")
                                                                                                           .firstName("Markus")
                                                                                                           .lastName("Wagner")
                                                                                                           .password("test")
                                                                                                           .build(), null),
                JwtAuthenticationResponse.class
        );

        assertThat(response.getStatusCode().is4xxClientError()).isTrue();
    }

    @Test
    void signin() {
        ResponseEntity<JwtAuthenticationResponse> response = testRestTemplate.exchange(
                "http://localhost:" + port + "/api/auth/signin", HttpMethod.POST, new HttpEntity<>(SignInRequest.builder()
                                                                                                           .email("other@other.de")
                                                                                                           .password("password")
                                                                                                           .build(), null),
                JwtAuthenticationResponse.class
        );

        assertThat(response.getStatusCode().is2xxSuccessful()).isTrue();
        assertThat(response.hasBody()).isTrue();
        assertThat(jwtService.extractUserName(response.getBody().getToken())).isEqualTo("other@other.de");
    }

    @Test
    void signinFailsForInvalidCredentials() {
        ResponseEntity<JwtAuthenticationResponse> response = testRestTemplate.exchange(
                "http://localhost:" + port + "/api/auth/signin", HttpMethod.POST, new HttpEntity<>(SignInRequest.builder()
                                                                                                           .email("other@other.de")
                                                                                                           .password("test")
                                                                                                           .build(), null),
                JwtAuthenticationResponse.class
        );

        assertThat(response.getStatusCode().is4xxClientError()).isTrue();
    }

    @Test
    void refreshToken() {
        ResponseEntity<JwtAuthenticationResponse> response = testRestTemplate.exchange(
                "http://localhost:" + port + "/api/auth/refresh", HttpMethod.GET, new HttpEntity<>(null, getAuthHeader()),
                JwtAuthenticationResponse.class
        );
        assertThat(response.getStatusCode().is2xxSuccessful()).isTrue();
        assertThat(response.hasBody()).isTrue();
        assertThat(jwtService.extractUserName(response.getBody().getToken())).isEqualTo("other@other.de");
    }

    private HttpHeaders getAuthHeader() {
        HttpHeaders authHeaders = new HttpHeaders();
        authHeaders.add("Authorization", "Bearer " + authToken);
        return authHeaders;
    }
}