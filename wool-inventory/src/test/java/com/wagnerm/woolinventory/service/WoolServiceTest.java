package com.wagnerm.woolinventory.service;

import com.wagnerm.woolinventory.service.data.Inventory;
import com.wagnerm.woolinventory.service.data.InventoryImage;
import com.wagnerm.woolinventory.service.data.InventoryRepository;
import com.wagnerm.woolinventory.service.data.InventoryTag;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.domain.Page;
import org.springframework.test.annotation.DirtiesContext;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

@SpringBootTest
@DirtiesContext(classMode = DirtiesContext.ClassMode.BEFORE_EACH_TEST_METHOD)
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.ANY)
class WoolServiceTest {
    @Autowired
    private WoolService woolService;

    private Inventory savedInventory;

    @Autowired
    InventoryRepository inventoryRepository;

    @BeforeEach
    void setup() {
        this.savedInventory = inventoryRepository.save(
                new Inventory("wool1", "black", "brand1", 50, 40, 50)
        );
        inventoryRepository.save(
                new Inventory("wool2", "white", "brand1", 50, 40, 50)
        );
        InventoryTag inventoryTag = new InventoryTag();
        inventoryTag.setTag("markus");
        InventoryImage inventoryImage = new InventoryImage();
        inventoryImage.setImageBase64("base1");
        Inventory inventory = new Inventory("wool3", "white", "brand1", 70, 40, 50);
        inventoryTag.setInventory(inventory);
        inventoryImage.setInventory(inventory);
        inventory.setImages(List.of(inventoryImage));
        inventory.setTags(List.of(inventoryTag));
        inventoryRepository.save(inventory);
    }

    @Test
    void getInventoriesAllOnOnePage() {
        List<Inventory> retrievedInventories = woolService.getInventories(
                0,
                20,
                "ASC",
                "id",
                "",
                "",
                "",
                -1,
                -1,
                -1,
                -1,
                -1,
                -1
        );
        assertThat(retrievedInventories.size()).isEqualTo(3);
    }

    @Test
    void getInventoriesMultiplePagesFirstPage() {
        List<Inventory> retrievedInventories = woolService.getInventories(
                0,
                2,
                "ASC",
                "id",
                "",
                "",
                "",
                -1,
                -1,
                -1,
                -1,
                -1,
                -1
        );
        assertThat(retrievedInventories.size()).isEqualTo(2);
    }

    @Test
    void getInventoriesMultiplePagesLastPage() {
        List<Inventory> retrievedInventories = woolService.getInventories(
                1,
                2,
                "ASC",
                "id",
                "",
                "",
                "",
                -1,
                -1,
                -1,
                -1,
                -1,
                -1
        );
        assertThat(retrievedInventories.size()).isEqualTo(1);
    }

    @Test
    void getInventoriesByColor() {
        List<Inventory> retrievedInventories = woolService.getInventories(
                0,
                20,
                "ASC",
                "id",
                "",
                "white",
                "",
                -1,
                -1,
                -1,
                -1,
                -1,
                -1
        );
        assertThat(retrievedInventories.size()).isEqualTo(2);
    }

    @Test
    void getInventoriesByInitialAmount() {
        List<Inventory> retrievedInventories = woolService.getInventories(
                0,
                20,
                "ASC",
                "id",
                "",
                "",
                "",
                60,
                80,
                -1,
                -1,
                -1,
                -1
        );
        assertThat(retrievedInventories.size()).isEqualTo(1);
    }

    @Test
    void getInventoryByIdFound() {
        assertThat(this.woolService.getInventoryById(savedInventory.getId())).isNotNull();
    }

    @Test
    void getInventoryByIdNotFound() {
        assertThatThrownBy(() -> {
            this.woolService.getInventoryById(-999);
        }).isInstanceOf(IllegalAccessError.class);
    }

    @Test
    void createInventory() {
        InventoryTag inventoryTag = new InventoryTag();
        inventoryTag.setTag("markus");
        InventoryTag inventoryTag2 = new InventoryTag();
        inventoryTag2.setTag("socks");
        List<InventoryTag> inventoryTagList = List.of(inventoryTag, inventoryTag2);

        InventoryImage inventoryImage = new InventoryImage();
        inventoryImage.setImageBase64("base1");
        InventoryImage inventoryImage2 = new InventoryImage();
        inventoryImage2.setImageBase64("base2");
        List<InventoryImage> inventoryImageList = List.of(inventoryImage, inventoryImage2);

        Inventory inventory = new Inventory("wool2", "white", "brand1", 50, 40, 50);
        inventory.setImages(inventoryImageList);
        inventory.setTags(inventoryTagList);

        Inventory createdInventory = woolService.createInventory(inventory);
        assertThat(createdInventory).isNotNull();

        Inventory retrievedInventory = inventoryRepository.findById(createdInventory.getId()).orElseThrow();

        assertThat(retrievedInventory).isNotNull();
        assertThat(retrievedInventory.getId()).isEqualTo(createdInventory.getId());
        assertThat(retrievedInventory.getName()).isEqualTo("wool2");
        assertThat(retrievedInventory.getColor()).isEqualTo("white");
        assertThat(retrievedInventory.getBrand()).isEqualTo("brand1");
        assertThat(retrievedInventory.getInitialAmount()).isEqualTo(50);
        assertThat(retrievedInventory.getRemainingAmount()).isEqualTo(40);
        assertThat(retrievedInventory.getSingleAmount()).isEqualTo(50);
        assertThat(retrievedInventory.getTags().size()).isEqualTo(2);
        assertThat(retrievedInventory.getImages().size()).isEqualTo(2);
    }

    @Test
    void updateInventory() {
        InventoryTag inventoryTag = new InventoryTag();
        inventoryTag.setTag("markus");
        InventoryTag inventoryTag2 = new InventoryTag();
        inventoryTag2.setTag("socks");
        List<InventoryTag> inventoryTagList = List.of(inventoryTag, inventoryTag2);

        InventoryImage inventoryImage = new InventoryImage();
        inventoryImage.setImageBase64("base1");
        InventoryImage inventoryImage2 = new InventoryImage();
        inventoryImage2.setImageBase64("base2");
        List<InventoryImage> inventoryImageList = List.of(inventoryImage, inventoryImage2);

        Inventory inventory = new Inventory("wool2", "white", "brand1", 50, 40, 50);
        inventory.setImages(inventoryImageList);
        inventory.setTags(inventoryTagList);

        Inventory updatedInventory = woolService.updateInventory(savedInventory.getId(), inventory);
        assertThat(updatedInventory).isNotNull();

        Inventory retrievedInventory = inventoryRepository.findById(updatedInventory.getId()).orElseThrow();

        assertThat(retrievedInventory).isNotNull();
        assertThat(retrievedInventory.getId()).isEqualTo(updatedInventory.getId());
        assertThat(retrievedInventory.getId()).isEqualTo(savedInventory.getId());
        assertThat(retrievedInventory.getName()).isEqualTo("wool2");
        assertThat(retrievedInventory.getColor()).isEqualTo("white");
        assertThat(retrievedInventory.getBrand()).isEqualTo("brand1");
        assertThat(retrievedInventory.getInitialAmount()).isEqualTo(50);
        assertThat(retrievedInventory.getRemainingAmount()).isEqualTo(40);
        assertThat(retrievedInventory.getSingleAmount()).isEqualTo(50);
        assertThat(retrievedInventory.getTags().size()).isEqualTo(2);
        assertThat(retrievedInventory.getImages().size()).isEqualTo(2);
    }

    @Test
    void deleteInventory() {
        woolService.deleteInventory(savedInventory.getId());
        assertThatThrownBy(() -> {
            this.woolService.getInventoryById(savedInventory.getId());
        }).isInstanceOf(IllegalAccessError.class);
    }
}