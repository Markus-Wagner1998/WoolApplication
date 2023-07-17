package com.wagnerm.woolinventory.service;

import com.wagnerm.woolinventory.service.data.Inventory;
import com.wagnerm.woolinventory.service.data.InventoryImage;
import lombok.RequiredArgsConstructor;
import org.apache.tomcat.util.codec.binary.Base64;
import org.springframework.stereotype.Service;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Comparator;
import java.util.LinkedList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ImageService {

    public void deleteInventoryImagesFromStorage(Inventory inventory) throws IOException {
        Path inventoryDirectory = Paths.get(
                System.getProperty("user.dir"),
                "images",
                String.valueOf(inventory.getUser().getId()),
                String.valueOf(inventory.getId())
        );
        if (inventoryDirectory.toFile().exists()) {
            Files.walk(inventoryDirectory)
                    .sorted(Comparator.reverseOrder())
                    .map(Path::toFile)
                    .forEach(File::delete);
        }
    }
    public List<String> readImagesFromStorage(Inventory inventory) throws IOException {
        List<String> imageStrings = new LinkedList<>();
        for (InventoryImage image : inventory.getImages()) {
            Path imagePath = Paths.get(
                    System.getProperty("user.dir"),
                    "images",
                    String.valueOf(image.getUser().getId()),
                    String.valueOf(inventory.getId()),
                    String.valueOf(image.getImageId())
            );
            if (imagePath.toFile().exists()) {
                byte[] allBytes = Files.readAllBytes(imagePath);
                imageStrings.add("data:image/png;base64," + Base64.encodeBase64String(allBytes));
            } else {
                imageStrings.add("");
            }
        }
        return imageStrings;
    }

    public void writeImagesToStorage(Inventory inventory) throws IOException {
        for (InventoryImage image : inventory.getImages()) {
            if (image.getImageBase64().length() > 22) {
                byte[] data = Base64.decodeBase64(image.getImageBase64().substring(22));
                Path imageDirectory = Paths.get(
                        System.getProperty("user.dir"),
                        "images"
                );
                if (!imageDirectory.toFile().exists()) {
                    imageDirectory.toFile().mkdir();
                }
                Path userDirectory = imageDirectory.resolve(String.valueOf(image.getUser().getId()));
                if (!userDirectory.toFile().exists()) {
                    userDirectory.toFile().mkdir();
                }
                Path inventoryDirectory = userDirectory.resolve(String.valueOf(inventory.getId()));
                if (!inventoryDirectory.toFile().exists()) {
                    inventoryDirectory.toFile().mkdir();
                }
                Path filePath = inventoryDirectory.resolve(String.valueOf(image.getImageId()));
                try (OutputStream stream = new FileOutputStream(filePath.toFile())) {
                    stream.write(data);
                }
            }
        }
    }

}
