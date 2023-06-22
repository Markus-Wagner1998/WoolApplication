package com.wagnerm.woolinventory.rest;

import com.wagnerm.woolinventory.service.data.Inventory;
import com.wagnerm.woolinventory.service.data.InventoryImage;
import com.wagnerm.woolinventory.service.data.InventoryRepository;
import com.wagnerm.woolinventory.service.data.InventoryTag;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.test.annotation.DirtiesContext;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@DirtiesContext(classMode = DirtiesContext.ClassMode.BEFORE_EACH_TEST_METHOD)
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.ANY)
class WoolControllerTest {
    @Value(value = "${local.server.port}")
    private int port;

    private Inventory savedInventory;

    @Autowired
    private TestRestTemplate testRestTemplate;

    @Autowired
    private InventoryRepository inventoryRepository;

    @BeforeEach
    void setup() {
        this.savedInventory = inventoryRepository.save(
                new Inventory("wool1", "black", "brand1", 5, 50, 40, 50)
        );
        inventoryRepository.save(
                new Inventory("wool2", "white", "brand1", 4, 50, 40, 50)
        );
        InventoryTag inventoryTag = new InventoryTag();
        inventoryTag.setTag("markus");
        InventoryImage inventoryImage = new InventoryImage();
        inventoryImage.setImageBase64("base1");
        Inventory inventory = new Inventory("wool2", "white", "brand1", 3, 50, 40, 50);
        inventoryTag.setInventory(inventory);
        inventoryImage.setInventory(inventory);
        inventory.setImages(List.of(inventoryImage));
        inventory.setTags(List.of(inventoryTag));
        inventoryRepository.save(inventory);
    }

    @Test
    void getInventories() {
        List<Inventory> resultList = testRestTemplate.getForObject("http://localhost:" + port + "/inventory", List.class);
        assertThat(resultList.size()).isEqualTo(3);
    }

    @Test
    void getInventoryById() {
        Inventory resultInventory =
                testRestTemplate.getForObject(
                        "http://localhost:" + port + "/inventory/" + savedInventory.getId(),
                        Inventory.class
                );
        assertThat(resultInventory).isNotNull();
        assertThat(resultInventory.getId()).isEqualTo(savedInventory.getId());
        assertThat(resultInventory.getName()).isEqualTo("wool1");
        assertThat(resultInventory.getColor()).isEqualTo("black");
        assertThat(resultInventory.getBrand()).isEqualTo("brand1");
        assertThat(resultInventory.getIntensity()).isEqualTo(5);
        assertThat(resultInventory.getSingleAmount()).isEqualTo(50);
        assertThat(resultInventory.getInitialAmount()).isEqualTo(50);
        assertThat(resultInventory.getRemainingAmount()).isEqualTo(40);
        assertThat(resultInventory.getImages().size()).isEqualTo(0);
        assertThat(resultInventory.getTags().size()).isEqualTo(0);
    }

    @Test
    void createInventory() {
        Inventory inventoryToSave = new Inventory("newWool", "newColor", "newBrand", 10, 20, 30, 40);
        Inventory resultInventory =
                testRestTemplate.postForObject(
                        "http://localhost:" + port + "/inventory",
                        inventoryToSave,
                        Inventory.class
                );
        assertThat(resultInventory).isNotNull();
        assertThat(resultInventory.getName()).isEqualTo(inventoryToSave.getName());
        assertThat(resultInventory.getColor()).isEqualTo(inventoryToSave.getColor());
        assertThat(resultInventory.getBrand()).isEqualTo(inventoryToSave.getBrand());
        assertThat(resultInventory.getIntensity()).isEqualTo(inventoryToSave.getIntensity());
        assertThat(resultInventory.getInitialAmount()).isEqualTo(inventoryToSave.getInitialAmount());
        assertThat(resultInventory.getRemainingAmount()).isEqualTo(inventoryToSave.getRemainingAmount());
        assertThat(resultInventory.getSingleAmount()).isEqualTo(inventoryToSave.getSingleAmount());
    }

    @Test
    void updateInventory() {
        Inventory inventoryToSave = new Inventory("newWool", "newColor", "newBrand", 1, 20, 30, 40);
        inventoryToSave.setId(savedInventory.getId());
        testRestTemplate.put("http://localhost:" + port + "/inventory/" + inventoryToSave.getId(), inventoryToSave);
        Inventory resultInventory =
                testRestTemplate.getForObject(
                        "http://localhost:" + port + "/inventory/" + savedInventory.getId(),
                        Inventory.class
                );
        assertThat(resultInventory).isNotNull();
        assertThat(resultInventory.getName()).isEqualTo(inventoryToSave.getName());
        assertThat(resultInventory.getColor()).isEqualTo(inventoryToSave.getColor());
        assertThat(resultInventory.getBrand()).isEqualTo(inventoryToSave.getBrand());
        assertThat(resultInventory.getIntensity()).isEqualTo(inventoryToSave.getIntensity());
        assertThat(resultInventory.getInitialAmount()).isEqualTo(inventoryToSave.getInitialAmount());
        assertThat(resultInventory.getRemainingAmount()).isEqualTo(inventoryToSave.getRemainingAmount());
        assertThat(resultInventory.getSingleAmount()).isEqualTo(inventoryToSave.getSingleAmount());
    }

    @Test
    void deleteInventory() {
        testRestTemplate.delete("http://localhost:" + port + "/inventory/" + savedInventory.getId());
        List<Inventory> resultList = testRestTemplate.getForObject("http://localhost:" + port + "/inventory", List.class);
        assertThat(resultList.size()).isEqualTo(2);
    }

}