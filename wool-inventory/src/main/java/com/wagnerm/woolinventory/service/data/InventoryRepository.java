package com.wagnerm.woolinventory.service.data;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Repository
public interface InventoryRepository extends JpaRepository<Inventory, Integer>, JpaSpecificationExecutor<Inventory> {
    List<Inventory> findByUserEmailAndBrandContains(String userEmail, String brand);

    Optional<Inventory> findByUserEmailAndId(String userEmail, Integer id);

    @Transactional
    void deleteByUserEmailAndId(String userEmail, Integer id);
}
