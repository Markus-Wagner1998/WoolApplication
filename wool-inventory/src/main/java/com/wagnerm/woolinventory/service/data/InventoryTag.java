package com.wagnerm.woolinventory.service.data;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "inventory_tags")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class InventoryTag {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "tag_id")
    private Integer id;
    @Column(name = "tag")
    private String tag;
    @ManyToOne
    @JoinColumn(name = "inventory_id", nullable = false)
    private Inventory inventory;

    public InventoryTag(String tag, Inventory inventory) {
        this.tag = tag;
        this.inventory = inventory;
    }
}