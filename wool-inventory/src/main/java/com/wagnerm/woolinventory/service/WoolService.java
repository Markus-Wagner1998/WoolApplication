package com.wagnerm.woolinventory.service;

import com.wagnerm.woolinventory.service.data.Inventory;
import com.wagnerm.woolinventory.service.data.InventoryImageRepository;
import com.wagnerm.woolinventory.service.data.InventoryRepository;
import com.wagnerm.woolinventory.service.data.InventoryTagRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class WoolService {
    private final InventoryRepository inventoryRepository;
    private final InventoryImageRepository inventoryImageRepository;
    private final InventoryTagRepository inventoryTagRepository;

    @Autowired
    public WoolService(InventoryRepository inventoryRepository, InventoryImageRepository inventoryImageRepository, InventoryTagRepository inventoryTagRepository) {
        this.inventoryRepository = inventoryRepository;
        this.inventoryImageRepository = inventoryImageRepository;
        this.inventoryTagRepository = inventoryTagRepository;
    }

    public List<Inventory> getInventories() {
        return inventoryRepository.findAll();
    }

    public Inventory getInventoryById(Integer inventoryId) {
        return inventoryRepository.findById(inventoryId).orElseThrow(IllegalAccessError::new);
    }

    public void createInventory(Inventory inventory) {
        inventory.setId(null);
        inventoryRepository.save(inventory);
    }

    @Transactional
    public void updateInventory(Integer inventoryId, Inventory inventory) {
        inventory.setId(inventoryId);
        if (inventory.getImages() != null) {
            inventoryImageRepository.deleteByInventoryId(inventoryId);
            inventory.getImages().forEach(inventoryImage -> inventoryImage.setInventory(inventory));
        }
        if (inventory.getTags() != null) {
            inventoryTagRepository.deleteByInventoryId(inventoryId);
            inventory.getTags().forEach(inventoryTag -> inventoryTag.setInventory(inventory));
        }
        inventoryRepository.save(inventory);
    }

    public void deleteInventory(Integer inventoryId) {
        inventoryRepository.deleteById(inventoryId);
    }
}
