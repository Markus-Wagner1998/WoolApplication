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
    public List<Inventory> getInventories() {
        return woolService.getInventories();
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
