package com.wagnerm.woolinventory.rest;

public class DuplicateUserException extends RuntimeException {

    public DuplicateUserException() {
        super();
    }

    public DuplicateUserException(String msg) {
        super(msg);
    }
}
