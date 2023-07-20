package com.wagnerm.woolinventory.rest;

import com.wagnerm.woolinventory.security.data.User;
import com.wagnerm.woolinventory.security.data.UserRepository;
import com.wagnerm.woolinventory.security.jwt.JwtService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.test.annotation.DirtiesContext;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@DirtiesContext(classMode = DirtiesContext.ClassMode.BEFORE_EACH_TEST_METHOD)
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.ANY)
class UserControllerTest {
    @Value(value = "${local.server.port}")
    private int port;
    @Autowired
    private TestRestTemplate testRestTemplate;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private JwtService jwtService;
    private String authToken;
    private User testUser;

    @BeforeEach
    void setup() {
        testUser = new User();
        testUser.setEmail("test@test.de");
        testUser.setPassword("test");
        testUser.setFirstName("Markus");
        testUser.setLastName("Wagner");
        testUser = userRepository.save(testUser);
        authToken = jwtService.generateToken(testUser);
    }

    @Test
    void getUser() {
        ResponseEntity<User> res = testRestTemplate.exchange(
                "http://localhost:" + port + "/api/user", HttpMethod.GET, new HttpEntity<>(null, getAuthHeader()),
                User.class
        );
        assertThat(res.getStatusCode().is2xxSuccessful()).isTrue();
        assertThat(res.hasBody()).isTrue();
        assertThat(res.getBody().getEmail()).isEqualTo("test@test.de");
        assertThat(res.getBody().getFirstName()).isEqualTo("Markus");
        assertThat(res.getBody().getLastName()).isEqualTo("Wagner");
        assertThat(res.getBody().getPassword()).isEqualTo("test");
    }

    @Test
    void updateUser() {
        ResponseEntity<User> res = testRestTemplate.exchange(
                "http://localhost:" + port + "/api/user", HttpMethod.PUT, new HttpEntity<>(User.builder().id(
                        testUser.getId()).email("test@test.de").firstName("Markus2").lastName("Wagner2").password("test").build(), getAuthHeader()),
                User.class
        );
        assertThat(res.getStatusCode().is2xxSuccessful()).isTrue();
        assertThat(res.hasBody()).isTrue();
        assertThat(res.getBody().getEmail()).isEqualTo("test@test.de");
        assertThat(res.getBody().getFirstName()).isEqualTo("Markus2");
        assertThat(res.getBody().getLastName()).isEqualTo("Wagner2");
        assertThat(res.getBody().getPassword()).isEqualTo("test");
    }

    @Test
    void updateUserOtherUserFails() {
        ResponseEntity<User> res = testRestTemplate.exchange(
                "http://localhost:" + port + "/api/user", HttpMethod.PUT, new HttpEntity<>(User.builder().id(
                        testUser.getId()).email("other@user.de").firstName("Markus2").lastName("Wagner2").password("test").build(), getAuthHeader()),
                User.class
        );
        assertThat(res.getStatusCode().is4xxClientError()).isTrue();
    }

    private HttpHeaders getAuthHeader() {
        HttpHeaders authHeaders = new HttpHeaders();
        authHeaders.add("Authorization", "Bearer " + authToken);
        return authHeaders;
    }

}