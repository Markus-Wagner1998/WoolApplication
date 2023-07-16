package com.wagnerm.woolinventory.rest;

import com.wagnerm.woolinventory.security.jwt.InvalidJwtException;
import com.wagnerm.woolinventory.service.error.InventoryNotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice
public class WoolExceptionHandler {

    @ExceptionHandler(InventoryNotFoundException.class)
    public ResponseEntity<HttpResponse> handleInventoryNotFoundException(InventoryNotFoundException exception) {
        return ResponseEntity.
                status(HttpStatus.NOT_FOUND)
                .body(new HttpResponse(HttpStatus.NOT_FOUND.value(), exception.getMessage()));
    }

    @ExceptionHandler(DuplicateUserException.class)
    public ResponseEntity<HttpResponse> handleDuplicateUserException(DuplicateUserException exception) {
        return ResponseEntity.
                status(HttpStatus.BAD_REQUEST)
                .body(new HttpResponse(HttpStatus.BAD_REQUEST.value(), exception.getMessage()));
    }

    @ExceptionHandler(InvalidJwtException.class)
    public ResponseEntity<HttpResponse> handleJwtException(InvalidJwtException exception) {
        return ResponseEntity.
                status(HttpStatus.BAD_REQUEST)
                .body(new HttpResponse(HttpStatus.BAD_REQUEST.value(), exception.getMessage()));
    }

    private record HttpResponse(int status, String message){};
}
