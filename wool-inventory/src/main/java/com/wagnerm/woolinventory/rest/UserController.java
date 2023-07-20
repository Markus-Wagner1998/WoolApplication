package com.wagnerm.woolinventory.rest;

import com.wagnerm.woolinventory.security.UserService;
import com.wagnerm.woolinventory.security.data.User;
import com.wagnerm.woolinventory.security.jwt.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;
    private final JwtService jwtService;

    @GetMapping()
    public User getUser(@RequestHeader(name = "Authorization") String authHeader) {
        return this.userService.getUserByEmail(jwtService.extractUserNameFromAuthHeader(authHeader));
    }

    @PutMapping()
    public User updateUser(@RequestHeader(name = "Authorization") String authHeader,
                           @RequestBody User user) {
        return this.userService.updateUser(jwtService.extractUserNameFromAuthHeader(authHeader), user);
    }
}
