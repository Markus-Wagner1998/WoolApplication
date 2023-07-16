package com.wagnerm.woolinventory.security.jwt;

public class InvalidJwtException extends RuntimeException {

     public InvalidJwtException() {
         super();
     }

     public InvalidJwtException(String msg) {
         super(msg);
     }
}
