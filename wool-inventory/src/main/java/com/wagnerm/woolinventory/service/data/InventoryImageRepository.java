package com.wagnerm.woolinventory.service.data;

import org.springframework.data.jpa.repository.JpaRepository;

public interface InventoryImageRepository extends JpaRepository<InventoryImage, Integer> {

    public void deleteByInventoryId(Integer id);
}
