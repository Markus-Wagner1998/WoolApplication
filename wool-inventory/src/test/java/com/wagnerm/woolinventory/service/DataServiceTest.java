package com.wagnerm.woolinventory.service;

import com.wagnerm.woolinventory.security.data.User;
import com.wagnerm.woolinventory.security.data.UserRepository;
import com.wagnerm.woolinventory.service.data.Inventory;
import com.wagnerm.woolinventory.service.data.InventoryRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.annotation.DirtiesContext;

import java.util.List;
import static org.assertj.core.api.Assertions.assertThat;


@SpringBootTest
@DirtiesContext(classMode = DirtiesContext.ClassMode.BEFORE_EACH_TEST_METHOD)
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.ANY)
class DataServiceTest {
    @Autowired
    private DataService dataService;
    @Autowired
    private InventoryRepository inventoryRepository;
    @Autowired
    private UserRepository userRepository;

    @BeforeEach
    void setup() {
        User user = userRepository.save(User.builder().email("test@test.de").firstName("test").lastName("test").password("pwd").build());
        inventoryRepository.save(new Inventory(user, "name", "color", "brand1", 1, 1, 1, 1));
        inventoryRepository.save(new Inventory(user, "name", "color", "brand2", 1, 1, 1, 1));

    }

    @Test
    void getBrandsWithResult() {
        List<String> brands = dataService.getBrands("test@test.de", "b");
        assertThat(brands.size()).isEqualTo(2);
        assertThat(brands.contains("brand1")).isTrue();
        assertThat(brands.contains("brand2")).isTrue();
    }

    @Test
    void getBrandsNoResult() {
        List<String> brands = dataService.getBrands("test@test.de", "searchString");
        assertThat(brands.size()).isEqualTo(0);
    }

}