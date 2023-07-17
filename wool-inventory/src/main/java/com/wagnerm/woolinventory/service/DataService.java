package com.wagnerm.woolinventory.service;

import com.wagnerm.woolinventory.security.data.UserRepository;
import com.wagnerm.woolinventory.service.data.InventoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DataService {
    private final InventoryRepository inventoryRepository;

    public List<String> getBrands(String userEmail, String brand) {
        return this.inventoryRepository.findByUserEmailAndBrandContains(userEmail, brand).stream().map(
                (inventory) -> inventory.getBrand()).collect(
                Collectors.toSet()).stream().toList();
    }

}
