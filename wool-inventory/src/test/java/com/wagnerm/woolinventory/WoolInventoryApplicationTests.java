package com.wagnerm.woolinventory;

import com.wagnerm.woolinventory.rest.WoolController;
import com.wagnerm.woolinventory.service.data.Inventory;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.domain.Page;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
class WoolInventoryApplicationTests {

    @Autowired
    private WoolController woolController;

    @Test
    void contextLoads() {
        assertThat(woolController).isNotNull();
    }

}
