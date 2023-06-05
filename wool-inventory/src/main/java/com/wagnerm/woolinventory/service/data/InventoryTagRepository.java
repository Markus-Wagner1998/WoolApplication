package com.wagnerm.woolinventory.service.data;

import org.springframework.data.jpa.repository.JpaRepository;

public interface InventoryTagRepository extends JpaRepository<InventoryTag, Integer> {
    public void deleteByInventoryId(Integer id);
}
