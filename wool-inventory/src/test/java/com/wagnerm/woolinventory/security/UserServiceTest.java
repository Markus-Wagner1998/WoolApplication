package com.wagnerm.woolinventory.security;

import com.wagnerm.woolinventory.security.data.User;
import com.wagnerm.woolinventory.security.data.UserRepository;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.test.annotation.DirtiesContext;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
@DirtiesContext(classMode = DirtiesContext.ClassMode.BEFORE_EACH_TEST_METHOD)
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.ANY)
class UserServiceTest {
    @Autowired
    private UserService userService;
    @Autowired
    private UserRepository userRepository;
    private User testUser;

    @BeforeEach
    void setUp() {
        testUser = User
                .builder()
                .email("test@test.de")
                .firstName("Markus")
                .lastName("Wagner")
                .password("test")
                .active(true)
                .build();
        testUser = userRepository.save(testUser);
    }

    @Test
    void userDetailsService() {
        UserDetailsService userDetailsService = userService.userDetailsService();
        UserDetails userDetails = userDetailsService.loadUserByUsername("test@test.de");
        assertThat(userDetails).isNotNull();
        assertThat(userDetails.getUsername()).isEqualTo(testUser.getEmail());
    }

    @Test
    void userDetailsServiceUserNotFound() {
        UserDetailsService userDetailsService = userService.userDetailsService();
        Assertions.assertThrows(
                UsernameNotFoundException.class, () -> userDetailsService.loadUserByUsername("other@user.de"));
    }

}