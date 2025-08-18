package com.carfinder.sales.exceptions;

public class DuplicateVinException extends RuntimeException {
    public DuplicateVinException(String vin) {
        super("Car with VIN already exists.");
    }
}
