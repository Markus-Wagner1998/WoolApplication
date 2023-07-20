package com.wagnerm.woolinventory.security;

import com.wagnerm.woolinventory.security.data.User;
import com.wagnerm.woolinventory.security.data.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;

    public UserDetailsService userDetailsService() {
        return new UserDetailsService() {
            @Override
            public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
                return userRepository.findByEmail(username).orElseThrow(() -> new UsernameNotFoundException(
                        "User with name %s could not be found".formatted(username)));
            }
        };
    }

    public User updateUser(String userEmail, User user) {
        if (!userEmail.equalsIgnoreCase(user.getEmail())) {
            throw new UsernameNotFoundException("User authentication does not match provided user object");
        }
        User dbUser = this.userRepository.findByEmail(userEmail).orElseThrow(() -> new UsernameNotFoundException(
                "User with id %s could not be found.".formatted(userEmail)));
        user.setId(dbUser.getId());
        return this.userRepository.save(user);
    }

    public User getUserByEmail(String userEmail) {
        return this.userRepository.findByEmail(userEmail).orElseThrow(() -> new UsernameNotFoundException(
                "User with email %s could not be found.".formatted(userEmail)));
    }

}
