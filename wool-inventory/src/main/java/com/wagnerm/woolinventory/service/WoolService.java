package com.wagnerm.woolinventory.service;

import com.wagnerm.woolinventory.service.data.Inventory;
import com.wagnerm.woolinventory.service.data.InventoryImageRepository;
import com.wagnerm.woolinventory.service.data.InventoryRepository;
import com.wagnerm.woolinventory.service.data.InventoryTagRepository;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.*;
import org.springframework.data.jpa.convert.QueryByExamplePredicateBuilder;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

import static org.springframework.data.domain.ExampleMatcher.GenericPropertyMatchers.contains;

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

    public List<Inventory> getInventories(int pageNumber,
                                          int pageSize,
                                          String sortOrder,
                                          String sortColumn,
                                          String name,
                                          String color,
                                          String brand,
                                          int initialAmountMin,
                                          int initialAmountMax,
                                          int remainingAmountMin,
                                          int remainingAmountMax,
                                          int singleAmountMin,
                                          int singleAmountMax) {
        ExampleMatcher matcher = ExampleMatcher
                .matching()
                .withMatcher("name", contains().ignoreCase())
                .withMatcher("color", contains().ignoreCase())
                .withMatcher("brand", contains().ignoreCase())
                .withIgnoreNullValues()
                .withIgnorePaths("initialAmount", "remainingAmount", "singleAmount");
        Inventory searchInventory = new Inventory();
        searchInventory.setName(name);
        searchInventory.setColor(color);
        searchInventory.setBrand(brand);

        Pageable page = PageRequest.of(
                pageNumber,
                pageSize,
                Sort.Direction.fromString(sortOrder),
                sortColumn
        );
        return inventoryRepository.findAll(
                this.getSpecForAmountsAndExample(
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
    }

    private Specification<Inventory> getSpecForAmountsAndExample(
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

    public Inventory getInventoryById(Integer inventoryId) {
        return inventoryRepository.findById(inventoryId).orElseThrow(IllegalAccessError::new);
    }

    public Inventory createInventory(Inventory inventory) {
        return this.saveInventoryWithId(null, inventory);
    }

    public Inventory updateInventory(Integer inventoryId, Inventory inventory) {
        return this.saveInventoryWithId(inventoryId, inventory);
    }

    @Transactional
    private Inventory saveInventoryWithId(Integer inventoryId, Inventory inventory) {
        inventory.setId(inventoryId);
        if (inventory.getImages() != null) {
            inventoryImageRepository.deleteByInventoryId(inventoryId);
            inventory.getImages().forEach(inventoryImage -> inventoryImage.setInventory(inventory));
        }
        if (inventory.getTags() != null) {
            inventoryTagRepository.deleteByInventoryId(inventoryId);
            inventory.getTags().forEach(inventoryTag -> inventoryTag.setInventory(inventory));
        }
        return inventoryRepository.save(inventory);
    }

    public void deleteInventory(Integer inventoryId) {
        inventoryRepository.deleteById(inventoryId);
    }
}
