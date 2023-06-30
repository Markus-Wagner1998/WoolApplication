package com.wagnerm.woolinventory.service.data;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;

public interface InventoryTagRepository extends JpaRepository<InventoryTag, Integer> {
    @Transactional
    @Modifying
    @Query("delete InventoryTag tag where tag.inventory.id = :id")
    public void deleteByInventoryId(Integer id);
}
