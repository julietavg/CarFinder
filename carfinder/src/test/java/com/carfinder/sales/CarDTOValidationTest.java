package com.carfinder.sales;

import com.carfinder.sales.dtos.CarDTO;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;

import jakarta.validation.*;
import java.math.BigDecimal;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;

class CarDTOValidationTest {

    private static Validator validator;

    @BeforeAll
    static void init() {
        ValidatorFactory factory = Validation.buildDefaultValidatorFactory();
        validator = factory.getValidator();
    }

    private CarDTO baseValid() {
        CarDTO dto = new CarDTO();
        dto.setVin("1HGCM82633A004352");
        dto.setMake("Toyota");
        dto.setModel("Corolla");
        dto.setSubModel("LE");
        dto.setYear(2020);
        dto.setMileage(10000);
        dto.setColor("Red");
        dto.setTransmission("Automatic");
        dto.setPrice(new BigDecimal("15000.00"));
        dto.setImage("https://example.com/car.jpg");
        return dto;
    }

    @Test
    void validDto_passes() {
        Set<ConstraintViolation<CarDTO>> violations = validator.validate(baseValid());
        assertTrue(violations.isEmpty());
    }

    @Test
    void vin_wrongLength_fails() {
        CarDTO dto = baseValid();
        dto.setVin("SHORTVIN1234567"); // 15
        var v = validator.validate(dto);
        assertFalse(v.isEmpty());
        assertTrue(v.stream().anyMatch(cv -> cv.getMessage().contains("exactly 17")));
    }

    @Test
    void vin_containsInvalidLetters_fails() {
        CarDTO dto = baseValid();
        dto.setVin("1IGCM82633A00Q352"); // incluye I y Q
        var v = validator.validate(dto);
        assertFalse(v.isEmpty());
        assertTrue(v.stream().anyMatch(cv -> cv.getMessage().contains("without I, O or Q")));
    }

    @Test
    void price_belowMinimum_fails() {
        CarDTO dto = baseValid();
        dto.setPrice(new BigDecimal("4999.99"));
        var v = validator.validate(dto);
        assertFalse(v.isEmpty());
        assertTrue(v.stream().anyMatch(cv -> cv.getMessage().contains("greater than 5000")));
    }

    @Test
    void image_invalidUrl_fails() {
        CarDTO dto = baseValid();
        dto.setImage("ftp://bad.url");
        var v = validator.validate(dto);
        assertFalse(v.isEmpty());
        assertTrue(v.stream().anyMatch(cv -> cv.getMessage().contains("valid URL")));
    }
}
