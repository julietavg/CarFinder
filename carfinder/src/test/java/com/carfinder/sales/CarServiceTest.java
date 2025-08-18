package com.carfinder.sales;

import static org.mockito.Mockito.*;
import static org.junit.jupiter.api.Assertions.*;

import com.carfinder.sales.dtos.CarDTO;
import com.carfinder.sales.entities.Car;
import com.carfinder.sales.exceptions.BusinessRuleViolationException;
import com.carfinder.sales.exceptions.ResourceNotFoundException;
import com.carfinder.sales.repositories.CarRepository;
import com.carfinder.sales.services.CarService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;
import org.mockito.InjectMocks;
import org.mockito.Mock;

import java.math.BigDecimal;
import java.util.Optional;

@ExtendWith(MockitoExtension.class)
class CarServiceTest {

    @Mock CarRepository carRepository;
    @InjectMocks CarService carService;

    private CarDTO validDto(String vin) {
        // IMPORTANT: No I/O/Q in VIN (service forbids them)
        CarDTO dto = new CarDTO();
        dto.setVin(vin);                         // e.g. "ABCDEFGH123456789"
        dto.setYear(2024);
        dto.setMake("FORD");
        dto.setModel("MUSTANG");
        dto.setSubModel("GT");
        dto.setTransmission("Automatic");
        dto.setColor("Red");
        dto.setImage("https://example.com/img");
        dto.setMileage(12345);
        dto.setPrice(new BigDecimal("35000"));
        return dto;
    }

    private Car existing(Long id, String vin) {
        Car c = new Car();
        c.setId(id);
        c.setVin(vin);
        c.setYear(2021);
        c.setMake("FORD");
        c.setModel("MUSTANG");
        c.setSubModel("GT");
        c.setTransmission("Automatic");
        c.setColor("Black");
        c.setImage("https://example.com/old");
        c.setMileage(10000);
        c.setPrice(new BigDecimal("30000"));
        return c;
    }

    @Test
    void createCar_ok_saves() {
        CarDTO dto = validDto("ABCDEFGH123456789");
        when(carRepository.existsByVin("ABCDEFGH123456789")).thenReturn(false);
        when(carRepository.save(any(Car.class))).thenAnswer(inv -> inv.getArgument(0));

        Car saved = carService.createCar(dto);
        assertEquals("ABCDEFGH123456789", saved.getVin());
        verify(carRepository).save(any(Car.class));
    }

    @Test
    void createCar_duplicateVin_throws409() {
        CarDTO dto = validDto("ABCDEFGH123456789");
        when(carRepository.existsByVin("ABCDEFGH123456789")).thenReturn(true);

        assertThrows(BusinessRuleViolationException.class, () -> carService.createCar(dto));
        verify(carRepository, never()).save(any());
    }

    @Test
    void updateCar_changeVin_throws_when_duplicate() {
        Long id = 1L;
        when(carRepository.findById(id)).thenReturn(Optional.of(existing(id, "OLDVIN123456789")));
        CarDTO dto = validDto("ABCDEFGH123456789");
        when(carRepository.existsByVinAndIdNot("ABCDEFGH123456789", id)).thenReturn(true);

        assertThrows(BusinessRuleViolationException.class, () -> carService.updateCar(id, dto));
        verify(carRepository).findById(id);
        verify(carRepository).existsByVinAndIdNot("ABCDEFGH123456789", id);
        verify(carRepository, never()).save(any());
    }

    @Test
    void updateCar_changeVin_allowed_when_unique_saves() {
        Long id = 1L;
        when(carRepository.findById(id)).thenReturn(Optional.of(existing(id, "OLDVIN123456789")));
        CarDTO dto = validDto("ABCDEFGH123456789");
        when(carRepository.existsByVinAndIdNot("ABCDEFGH123456789", id)).thenReturn(false);
        when(carRepository.save(any(Car.class))).thenAnswer(inv -> inv.getArgument(0));

        Car updated = carService.updateCar(id, dto);
        assertEquals("ABCDEFGH123456789", updated.getVin());
        verify(carRepository).save(any(Car.class));
    }

    @Test
    void deleteCar_notFound_throws404() {
        when(carRepository.existsById(999L)).thenReturn(false);
        assertThrows(ResourceNotFoundException.class, () -> carService.deleteCar(999L));
    }

    @Test
    void deleteCar_ok() {
        when(carRepository.existsById(1L)).thenReturn(true);
        carService.deleteCar(1L);
        verify(carRepository).deleteById(1L);
    }

    @Test
    void getCarById_notFound_throws404() {
        when(carRepository.findById(5L)).thenReturn(Optional.empty());
        assertThrows(ResourceNotFoundException.class, () -> carService.getCarById(5L));
    }

    @Test
    void getCarById_ok() {
        when(carRepository.findById(1L)).thenReturn(Optional.of(existing(1L, "ABCDEFGH123456789")));
        Car c = carService.getCarById(1L);
        assertEquals("ABCDEFGH123456789", c.getVin());
    }
}
