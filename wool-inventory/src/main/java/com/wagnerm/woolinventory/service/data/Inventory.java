package com.wagnerm.woolinventory.service.data;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
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

    @NotNull
    @NotEmpty
    @Column(name = "name")
    private String name;

    @NotNull
    @NotEmpty
    @Column(name = "color")
    private String color;

    @NotNull
    @NotEmpty
    @Column(name = "brand")
    private String brand;

    @Min(1)
    @Column(name="intensity")
    private int intensity;

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

    public Inventory(String name, String color, String brand, int intensity, int initialAmount, int remainingAmount, int singleAmount) {
        this.name = name;
        this.color = color;
        this.brand = brand;
        this.intensity = intensity;
        this.initialAmount = initialAmount;
        this.remainingAmount = remainingAmount;
        this.singleAmount = singleAmount;
    }

}
