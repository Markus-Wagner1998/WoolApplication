package com.wagnerm.woolinventory.service.data;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "inventory_images")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class InventoryImage {
    @Id()
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "image_id")
    private Integer imageId;
    @Column(name = "image")
    private String imageBase64;
    @ManyToOne
    @JoinColumn(name = "inventory_id", nullable = false)
    private Inventory inventory;

    public InventoryImage(String imageBase64, Inventory inventory) {
        this.imageBase64 = imageBase64;
        this.inventory = inventory;
    }
}
