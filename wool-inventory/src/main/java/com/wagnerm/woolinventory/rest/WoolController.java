package com.wagnerm.woolinventory.rest;

import com.wagnerm.woolinventory.security.jwt.JwtService;
import com.wagnerm.woolinventory.service.WoolService;
import com.wagnerm.woolinventory.service.data.Inventory;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/inventory")
public class WoolController {
    private final WoolService woolService;
    private final JwtService jwtService;

    @GetMapping()
    public List<Inventory> getInventories(
            @RequestHeader(name = "Authorization") String authHeader,
            @RequestParam(name = "pageNumber", required = false, defaultValue = "0") int pageNumber,
            @RequestParam(name = "pageSize", required = false, defaultValue = "20") int pageSize,
            @RequestParam(name = "sortOrder", required = false, defaultValue = "ASC") String sortOrder,
            @RequestParam(name = "sortColumn", required = false, defaultValue = "name") String sortColumn,
            @RequestParam(name = "name", required = false) String name,
            @RequestParam(name = "color", required = false) String color,
            @RequestParam(name = "brand", required = false) String brand,
            @RequestParam(name = "intensityMin", required = false, defaultValue = "-1") Integer intensityMin,
            @RequestParam(name = "intensityMax", required = false, defaultValue = "-1") Integer intensityMax,
            @RequestParam(name = "initialAmountMin", required = false, defaultValue = "-1") int initialAmountMin,
            @RequestParam(name = "initialAmountMax", required = false, defaultValue = "-1") int initialAmountMax,
            @RequestParam(name = "remainingAmountMin", required = false, defaultValue = "-1") int remainingAmountMin,
            @RequestParam(name = "remainingAmountMax", required = false, defaultValue = "-1") int remainingAmountMax,
            @RequestParam(name = "singleAmountMin", required = false, defaultValue = "-1") int singleAmountMin,
            @RequestParam(name = "singleAmountMax", required = false, defaultValue = "-1") int singleAmountMax
    ) {
        return woolService.getInventories(
                jwtService.extractUserNameFromAuthHeader(authHeader),
                pageNumber,
                pageSize,
                sortOrder,
                sortColumn,
                name,
                color,
                brand,
                intensityMin,
                intensityMax,
                initialAmountMin,
                initialAmountMax,
                remainingAmountMin,
                remainingAmountMax,
                singleAmountMin,
                singleAmountMax
        );
    }

    @GetMapping("/{inventoryId}")
    public Inventory getInventoryById(
            @RequestHeader(name = "Authorization") String authHeader,
            @PathVariable("inventoryId") Integer inventoryId) {
        return woolService.getInventoryById(this.jwtService.extractUserNameFromAuthHeader(authHeader), inventoryId);
    }

    @PostMapping()
    public Inventory createInventory(
            @RequestHeader("Authorization") String authHeader,
            @Valid @RequestBody Inventory inventory
    ) {
        return this.woolService.createInventory(this.jwtService.extractUserNameFromAuthHeader(authHeader), inventory);
    }

    @PutMapping("/{inventoryId}")
    public Inventory updateInventory(
            @RequestHeader("Authorization") String authHeader,
            @PathVariable("inventoryId") Integer inventoryId,
            @Valid @RequestBody Inventory inventory
    ) {
        return woolService.updateInventory(this.jwtService.extractUserNameFromAuthHeader(authHeader), inventoryId, inventory);
    }

    @DeleteMapping("/{inventoryId}")
    public void deleteInventory(
            @RequestHeader(name = "Authorization") String authHeader,
            @PathVariable("inventoryId") Integer inventoryId) {
        woolService.deleteInventory(this.jwtService.extractUserNameFromAuthHeader(authHeader), inventoryId);
    }
}
