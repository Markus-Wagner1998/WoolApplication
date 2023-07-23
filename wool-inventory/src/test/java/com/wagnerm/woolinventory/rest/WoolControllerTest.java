package com.wagnerm.woolinventory.rest;

import com.wagnerm.woolinventory.security.data.User;
import com.wagnerm.woolinventory.security.data.UserRepository;
import com.wagnerm.woolinventory.security.jwt.JwtService;
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
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
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

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtService jwtService;

    private String authToken;

    private User testUser;

    @BeforeEach
    void setup() {
        testUser = new User();
        testUser.setEmail("test@test.de");
        testUser.setPassword("test");
        testUser.setFirstName("Markus");
        testUser.setLastName("Wagner");
        testUser.setActive(true);
        testUser = userRepository.save(testUser);

        this.savedInventory = inventoryRepository.save(
                new Inventory(testUser, "wool1", "black", "brand1", 5, 50, 40, 50)
        );
        inventoryRepository.save(
                new Inventory(testUser, "wool2", "white", "brand1", 4, 50, 40, 50)
        );
        InventoryTag inventoryTag = new InventoryTag();
        inventoryTag.setTag("markus");
        InventoryImage inventoryImage = new InventoryImage();
        inventoryImage.setImageBase64("base1");
        Inventory inventory = new Inventory(testUser, "wool2", "white", "brand1", 3, 50, 40, 50);
        inventoryTag.setInventory(inventory);
        inventoryTag.setUser(testUser);
        inventoryImage.setInventory(inventory);
        inventoryImage.setUser(testUser);
        inventory.setImages(List.of(inventoryImage));
        inventory.setTags(List.of(inventoryTag));
        inventoryRepository.save(inventory);

        authToken = jwtService.generateToken(testUser);
    }

    @Test
    void getInventories() {
        ResponseEntity<List> res = testRestTemplate.exchange(
                "http://localhost:" + port + "/api/inventory", HttpMethod.GET, new HttpEntity<>(null, getAuthHeader()),
                List.class
        );
        assertThat(res.getStatusCode().is2xxSuccessful()).isTrue();
        assertThat(res.hasBody()).isTrue();
        assertThat(res.getBody().size()).isEqualTo(3);
    }

    @Test
    void getInventoryById() {
        ResponseEntity<Inventory> res = testRestTemplate.exchange(
                "http://localhost:" + port + "/api/inventory/" + savedInventory.getId(),
                HttpMethod.GET,
                new HttpEntity<>(null, getAuthHeader()),
                Inventory.class
        );
        assertThat(res.getStatusCode().is2xxSuccessful()).isTrue();
        assertThat(res.hasBody()).isTrue();
        Inventory resultInventory = res.getBody();
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
        Inventory inventoryToSave = new Inventory(testUser, "newWool", "newColor", "newBrand", 10, 20, 30, 40);
        ResponseEntity<Inventory> res = testRestTemplate.exchange(
                "http://localhost:" + port + "/api/inventory",
                HttpMethod.POST,
                new HttpEntity<>(inventoryToSave, getAuthHeader()),
                Inventory.class
        );
        assertThat(res.getStatusCode().is2xxSuccessful()).isTrue();
        assertThat(res.hasBody()).isTrue();
        Inventory resultInventory = res.getBody();
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
        Inventory inventoryToSave = new Inventory(testUser, "newWool", "newColor", "newBrand", 1, 20, 30, 40);
        inventoryToSave.setId(savedInventory.getId());
        ResponseEntity<Inventory> res = testRestTemplate.exchange(
                "http://localhost:" + port + "/api/inventory/" + inventoryToSave.getId(),
                HttpMethod.PUT,
                new HttpEntity<>(inventoryToSave, getAuthHeader()),
                Inventory.class
        );
        assertThat(res.getStatusCode().is2xxSuccessful()).isTrue();
        assertThat(res.hasBody()).isTrue();
        Inventory resultInventory = res.getBody();
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
        ResponseEntity<String> res = testRestTemplate.exchange(
                "http://localhost:" + port + "/api/inventory/" + savedInventory.getId(),
                HttpMethod.DELETE,
                new HttpEntity<>(null, getAuthHeader()),
                String.class
        );
        assertThat(res.getStatusCode().is2xxSuccessful()).isTrue();
        ResponseEntity<List> resultListEntity = testRestTemplate.exchange(
                "http://localhost:" + port + "/api/inventory", HttpMethod.GET, new HttpEntity<>(null, getAuthHeader()),
                List.class
        );
        assertThat(resultListEntity.getStatusCode().is2xxSuccessful()).isTrue();
        assertThat(resultListEntity.hasBody()).isTrue();
        assertThat(resultListEntity.getBody().size()).isEqualTo(2);
    }

    private HttpHeaders getAuthHeader() {
        HttpHeaders authHeaders = new HttpHeaders();
        authHeaders.add("Authorization", "Bearer " + authToken);
        return authHeaders;
    }

}