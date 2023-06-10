package com.wagnerm.woolinventory.service.error;

public class InventoryNotFoundException extends RuntimeException {

    public InventoryNotFoundException() {
    }

    public InventoryNotFoundException(String message) {
        super(message);
    }
}
