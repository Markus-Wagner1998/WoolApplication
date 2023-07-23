package com.wagnerm.woolinventory.service;

import com.wagnerm.woolinventory.security.data.User;
import com.wagnerm.woolinventory.security.data.UserRepository;
import com.wagnerm.woolinventory.service.data.*;
import com.wagnerm.woolinventory.service.error.InventoryNotFoundException;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;
import lombok.RequiredArgsConstructor;
import org.apache.tomcat.util.codec.binary.Base64;
import org.springframework.data.domain.*;
import org.springframework.data.jpa.convert.QueryByExamplePredicateBuilder;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.*;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.*;

import static org.springframework.data.domain.ExampleMatcher.GenericPropertyMatchers.contains;

@RequiredArgsConstructor
@Service
public class WoolService {
    private final UserRepository userRepository;
    private final ImageService imageService;
    private final InventoryRepository inventoryRepository;
    private final InventoryImageRepository inventoryImageRepository;
    private final InventoryTagRepository inventoryTagRepository;

    public List<Inventory> getInventories(
            String userEmail,
            int pageNumber,
            int pageSize,
            String sortOrder,
            String sortColumn,
            String name,
            String color,
            String brand,
            int intensityMin,
            int intensityMax,
            int initialAmountMin,
            int initialAmountMax,
            int remainingAmountMin,
            int remainingAmountMax,
            int singleAmountMin,
            int singleAmountMax
    ) {
        ExampleMatcher matcher = ExampleMatcher
                .matching()
                .withMatcher("name", contains().ignoreCase())
                .withMatcher("color", contains().ignoreCase())
                .withMatcher("brand", contains().ignoreCase())
                .withIgnoreNullValues()
                .withIgnorePaths("initialAmount", "remainingAmount", "singleAmount", "intensity");
        Inventory searchInventory = new Inventory();
        searchInventory.setName(name);
        searchInventory.setColor(color);
        searchInventory.setBrand(brand);
        searchInventory.setUser(userRepository.findByEmailAndActive(userEmail, true).orElse(null));

        Pageable page = PageRequest.of(
                pageNumber,
                pageSize,
                Sort.Direction.fromString(sortOrder),
                sortColumn
        );
        List<Inventory> foundInventories = inventoryRepository.findAll(
                this.getSpecForAmountsAndExample(
                        intensityMin,
                        intensityMax,
                        initialAmountMin,
                        initialAmountMax,
                        remainingAmountMin,
                        remainingAmountMax,
                        singleAmountMin,
                        singleAmountMax,
                        Example.of(searchInventory, matcher)
                ),
                page
        ).getContent();
        foundInventories.forEach((inventory -> addImageContentToInventory(inventory)));
        return foundInventories;
    }

    public Inventory getInventoryById(String userEmail, Integer inventoryId) {
        Inventory dbInventory = inventoryRepository.findByUserEmailAndId(userEmail, inventoryId).orElseThrow(
                () -> new InventoryNotFoundException("Inventory with id " + inventoryId + " could not be found")
        );
        addImageContentToInventory(dbInventory);
        return dbInventory;
    }

    void addImageContentToInventory(Inventory inventory) {
        try {
            List<String> imageStrings = this.imageService.readImagesFromStorage(inventory);
            for (int imageIdx = 0; imageIdx < inventory.getImages().size(); imageIdx++) {
                inventory.getImages().get(imageIdx).setImageBase64(imageStrings.get(imageIdx));
            }
        } catch (IOException e) {
            throw new RuntimeException("Images could not be read from file system");
        }
    }

    public Inventory createInventory(String userEmail, Inventory inventory) {
        User user = userRepository.findByEmailAndActive(userEmail, true).get();
        inventory.setUser(user);
        return this.saveInventoryWithId(null, inventory);
    }

    public Inventory updateInventory(String userEmail, Integer inventoryId, Inventory inventory) {
        User user = userRepository.findByEmailAndActive(userEmail, true).get();
        inventory.setUser(user);
        return this.saveInventoryWithId(inventoryId, inventory);
    }

    @Transactional
    private Inventory saveInventoryWithId(Integer inventoryId, Inventory inventory) {
        inventory.setId(inventoryId);
        if (inventory.getImages() != null) {
            inventoryImageRepository.deleteByInventoryId(inventoryId);
            inventory.getImages().forEach(inventoryImage -> {
                inventoryImage.setInventory(inventory);
                inventoryImage.setUser(inventory.getUser());
            });
        }
        if (inventory.getTags() != null) {
            inventoryTagRepository.deleteByInventoryId(inventoryId);
            inventory.getTags().forEach(inventoryTag -> {
                inventoryTag.setInventory(inventory);
                inventoryTag.setUser(inventory.getUser());
            });
        }
        Inventory storedInventory = inventoryRepository.save(inventory);
        try {
            this.imageService.deleteInventoryImagesFromStorage(inventory);
            if (storedInventory.getImages() != null) {
                for (int idx = 0; idx < storedInventory.getImages().size(); idx++) {
                    storedInventory.getImages().get(idx).setImageBase64(inventory.getImages().get(idx).getImageBase64());
                }
                this.imageService.writeImagesToStorage(storedInventory);
            }
        } catch (IOException e) {
            throw new RuntimeException("Image could not be stored on file system!");
        }
        return storedInventory;
    }

    public void deleteInventory(String userEmail, Integer inventoryId) {
        Optional<Inventory> inventoryToDelete = inventoryRepository.findByUserEmailAndId(userEmail, inventoryId);
        if (inventoryToDelete.isPresent()) {
            try {
                this.imageService.deleteInventoryImagesFromStorage(inventoryToDelete.get());
            } catch (IOException e) {
                e.printStackTrace();
                throw new RuntimeException(e);
            }
            inventoryRepository.deleteByUserEmailAndId(userEmail, inventoryId);
        }
    }

    private Specification<Inventory> getSpecForAmountsAndExample(
            int intensityMin,
            int intensityMax,
            int initialAmountMin,
            int initialAmountMax,
            int remainingAmountMin,
            int remainingAmountMax,
            int singleAmountMin,
            int singleAmountMax,
            Example<Inventory> example) {
        return (root, query, builder) -> {
            final List<Predicate> predicates = new ArrayList<>();
            predicates.addAll(
                    this.getPredicateForField(
                            builder,
                            root,
                            "intensity",
                            intensityMin,
                            intensityMax
                    )
            );
            predicates.addAll(
                    this.getPredicateForField(
                            builder,
                            root,
                            "initialAmount",
                            initialAmountMin,
                            initialAmountMax
                    )
            );
            predicates.addAll(
                    this.getPredicateForField(
                            builder,
                            root,
                            "remainingAmount",
                            remainingAmountMin,
                            remainingAmountMax
                    )
            );
            predicates.addAll(
                    this.getPredicateForField(
                            builder,
                            root,
                            "singleAmount",
                            singleAmountMin,
                            singleAmountMax
                    )
            );
            Predicate predicate = QueryByExamplePredicateBuilder.getPredicate(root, builder, example);
            if (predicate != null) {
                predicates.add(predicate);
            }
            return builder.and(predicates.toArray(new Predicate[predicates.size()]));
        };
    }

    private List<Predicate> getPredicateForField(CriteriaBuilder builder,
                                                 Root<Inventory> criteriaRoot,
                                                 String fieldName,
                                                 int minValue,
                                                 int maxValue) {
        final List<Predicate> predicates = new ArrayList<>();
        if (minValue != -1) {
            predicates.add(builder.greaterThanOrEqualTo(criteriaRoot.get(fieldName), minValue));
        }
        if (maxValue != -1) {
            predicates.add(builder.lessThanOrEqualTo(criteriaRoot.get(fieldName), maxValue));
        }
        return predicates;
    }

}
