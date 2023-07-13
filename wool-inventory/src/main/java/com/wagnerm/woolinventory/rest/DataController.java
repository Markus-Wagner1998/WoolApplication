package com.wagnerm.woolinventory.rest;

import com.wagnerm.woolinventory.service.DataService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/data")
@RequiredArgsConstructor
public class DataController {
    private final DataService dataService;

    @GetMapping("/brand/{brand}")
    public List<String> getBrands(@PathVariable("brand") String brand) {
        return dataService.getBrands(brand);
    }
}
