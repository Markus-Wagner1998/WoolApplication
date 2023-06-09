package com.wagnerm.woolinventory.service.data;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Entity
@Table(name = "inventory")
@Data
@NoArgsConstructor
@JsonIdentityInfo(
        generator = ObjectIdGenerators.PropertyGenerator.class,
        property = "id")
public class Inventory {
    @Id()
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;
    @Column(name = "name")
    private String name;
    @Column(name = "color")
    private String color;
    @Column(name = "brand")
    private String brand;
    @Column(name = "initial_amount")
    private int initialAmount;
    @Column(name = "remaining_amount")
    private int remainingAmount;
    @Column(name = "single_amount")
    private int singleAmount;
    @OneToMany(mappedBy = "inventory", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    private List<InventoryTag> tags;
    @OneToMany(mappedBy = "inventory", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    private List<InventoryImage> images;

    public Inventory(String name, String color, String brand, int initialAmount, int remainingAmount, int singleAmount) {
        this.name = name;
        this.color = color;
        this.brand = brand;
        this.initialAmount = initialAmount;
        this.remainingAmount = remainingAmount;
        this.singleAmount = singleAmount;
    }

}
