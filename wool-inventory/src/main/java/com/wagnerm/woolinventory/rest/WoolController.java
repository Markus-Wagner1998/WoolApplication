package com.wagnerm.woolinventory.rest;

import com.wagnerm.woolinventory.service.WoolService;
import com.wagnerm.woolinventory.service.data.Inventory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/inventory")
public class WoolController {
    private final WoolService woolService;

    @Autowired
    public WoolController(WoolService woolService) {
        this.woolService = woolService;
    }

    @GetMapping()
    public List<Inventory> getInventories(@RequestParam(name = "name", required = false) String name,
                                          @RequestParam(name = "color", required = false) String color,
                                          @RequestParam(name = "brand", required = false) String brand,
                                          @RequestParam(name = "initialAmountMin", required = false, defaultValue = "-1") int initialAmountMin,
                                          @RequestParam(name = "initialAmountMax", required = false, defaultValue = "-1") int initialAmountMax,
                                          @RequestParam(name = "remainingAmountMin", required = false, defaultValue = "-1") int remainingAmountMin,
                                          @RequestParam(name = "remainingAmountMax", required = false, defaultValue = "-1") int remainingAmountMax,
                                          @RequestParam(name = "singleAmountMin", required = false, defaultValue = "-1") int singleAmountMin,
                                          @RequestParam(name = "singleAmountMax", required = false, defaultValue = "-1") int singleAmountMax
                                          ) {
        return woolService.getInventories(
                name,
                color,
                brand,
                initialAmountMin,
                initialAmountMax,
                remainingAmountMin,
                remainingAmountMax,
                singleAmountMin,
                singleAmountMax
        );
    }

    @GetMapping("/{inventoryId}")
    public Inventory getInventoryById(@PathVariable("inventoryId") Integer inventoryId) {
        return woolService.getInventoryById(inventoryId);
    }

    @PostMapping()
    public void createInventory(@RequestBody Inventory inventory) {
        this.woolService.createInventory(inventory);
    }

    @PutMapping("/{inventoryId}")
    public void updateInventory(@PathVariable("inventoryId") Integer inventoryId, @RequestBody Inventory inventory) {
        woolService.updateInventory(inventoryId, inventory);
    }

    @DeleteMapping("/{inventoryId}")
    public void deleteInventory(@PathVariable("inventoryId") Integer inventoryId) {
        woolService.deleteInventory(inventoryId);
    }
}
