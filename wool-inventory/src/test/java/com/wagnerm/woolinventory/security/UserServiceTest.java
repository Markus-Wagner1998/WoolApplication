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

    @Test
    void updateUser() {
        User updatedUser = userService.updateUser(
                "test@test.de",
                User.builder()
                        .email("test@test.de")
                        .firstName("Markus2")
                        .lastName("Wagner2")
                        .password("test")
                        .build()
        );
        assertThat(updatedUser).isNotNull();
        assertThat(updatedUser.getId()).isEqualTo(testUser.getId());
        assertThat(updatedUser.getEmail()).isEqualTo(testUser.getEmail());
        assertThat(updatedUser.getFirstName()).isEqualTo("Markus2");
        assertThat(updatedUser.getLastName()).isEqualTo("Wagner2");
        assertThat(updatedUser.getPassword()).isEqualTo(testUser.getPassword());
    }

    @Test
    void updateUserForOtherUserFails() {
        Assertions.assertThrows(
                UsernameNotFoundException.class,
                () -> userService.updateUser(
                        "other@user.de",
                        User.builder()
                                .email("test@test.de")
                                .firstName("Markus2")
                                .lastName("Wagner2")
                                .password("test")
                                .build()
                ));
    }

    @Test
    void updateUserNonExistentUser() {
        Assertions.assertThrows(
                UsernameNotFoundException.class,
                () -> userService.updateUser(
                        "other@user.de",
                        User.builder()
                                .email("other@user.de")
                                .firstName("Markus2")
                                .lastName("Wagner2")
                                .password("test")
                                .build()
                ));
    }

    @Test
    void getUserByEmail() {
        User user = userService.getUserByEmail("test@test.de");
        assertThat(user).isNotNull();
        assertThat(user.getId()).isEqualTo(testUser.getId());
        assertThat(user.getEmail()).isEqualTo(testUser.getEmail());
        assertThat(user.getFirstName()).isEqualTo(testUser.getFirstName());
        assertThat(user.getLastName()).isEqualTo(testUser.getLastName());
        assertThat(user.getPassword()).isEqualTo(testUser.getPassword());
    }

    @Test
    void getUserByEmailFailsForNonExistentUser() {
        Assertions.assertThrows(UsernameNotFoundException.class,
                                () -> userService.getUserByEmail("non-existent@user.de"));
    }
}