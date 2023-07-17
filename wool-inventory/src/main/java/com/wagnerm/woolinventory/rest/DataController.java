package com.wagnerm.woolinventory.rest;

import com.wagnerm.woolinventory.security.jwt.JwtService;
import com.wagnerm.woolinventory.service.DataService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/data")
@RequiredArgsConstructor
public class DataController {
    private final DataService dataService;
    private final JwtService jwtService;

    @GetMapping("/brand/{brand}")
    public List<String> getBrands(@RequestHeader("Authorization") String authorization, @PathVariable("brand") String brand) {
        return dataService.getBrands(jwtService.extractUserNameFromAuthHeader(authorization), brand);
    }
}
