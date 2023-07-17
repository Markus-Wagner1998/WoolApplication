package com.wagnerm.woolinventory.service.data;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public interface InventoryImageRepository extends JpaRepository<InventoryImage, Integer> {

    @Transactional
    @Modifying
    @Query("delete InventoryImage image where image.inventory.id = :id")
    public void deleteByInventoryId(Integer id);
}
