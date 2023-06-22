package com.wagnerm.woolinventory.service.data;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.transaction.annotation.Transactional;

public interface InventoryImageRepository extends JpaRepository<InventoryImage, Integer> {

    @Transactional
    public void deleteByInventoryId(Integer id);
}
