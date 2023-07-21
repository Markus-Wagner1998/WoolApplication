package com.wagnerm.woolinventory.rest;

import com.wagnerm.woolinventory.security.jwt.JwtAuthenticationService;
import com.wagnerm.woolinventory.security.jwt.JwtService;
import com.wagnerm.woolinventory.service.data.UpdateUserDTO;
import com.wagnerm.woolinventory.service.data.UserDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
public class UserController {
    private final JwtAuthenticationService jwtAuthenticationService;
    private final JwtService jwtService;

    @GetMapping()
    public UserDTO getUser(@RequestHeader(name = "Authorization") String authHeader) {
        return this.jwtAuthenticationService.getUserByEmail(jwtService.extractUserNameFromAuthHeader(authHeader));
    }

    @PutMapping()
    public UserDTO updateUser(@RequestHeader(name = "Authorization") String authHeader,
                              @RequestBody UpdateUserDTO user) {
        return this.jwtAuthenticationService.updateUser(jwtService.extractUserNameFromAuthHeader(authHeader), user);
    }
}
