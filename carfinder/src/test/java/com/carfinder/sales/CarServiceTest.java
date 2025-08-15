package com.carfinder.sales;

import com.carfinder.sales.dtos.CarDTO;
import com.carfinder.sales.entities.Car;
import com.carfinder.sales.exceptions.BusinessRuleViolationException;
import com.carfinder.sales.exceptions.ResourceNotFoundException;
import com.carfinder.sales.repositories.CarRepository;
import com.carfinder.sales.services.CarService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;
import java.math.BigDecimal;
import java.util.Optional;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class CarServiceTest {

    @Mock
    private CarRepository carRepository;

    @InjectMocks
    private CarService carService;

    private CarDTO validDto;
    private Car existing;

    @BeforeEach
    void setup() {
        MockitoAnnotations.openMocks(this);

        validDto = new CarDTO();
        validDto.setId(null);
        validDto.setVin("1HGCM82633A004352");
        validDto.setMake("Toyota");
        validDto.setModel("Corolla");
        validDto.setSubModel("LE");
        validDto.setYear(2020);
        validDto.setMileage(10000);
        validDto.setColor("Red");
        validDto.setTransmission("Automatic");
        validDto.setPrice(new BigDecimal("15000.00"));
        validDto.setImage("https://example.com/car.jpg");

        existing = new Car();
        existing.setId(1L);
        existing.setVin("1HGCM82633A004352");
        existing.setMake("Toyota");
        existing.setModel("Corolla");
        existing.setSubModel("LE");
        existing.setYear(2020);
        existing.setMileage(10000);
        existing.setColor("Red");
        existing.setTransmission("Automatic");
        existing.setPrice(new BigDecimal("15000.00"));
        existing.setImage("https://example.com/car.jpg");
    }

    @Test
    void createCar_success() {
        when(carRepository.existsByVin("1HGCM82633A004352")).thenReturn(false);
        when(carRepository.save(any(Car.class))).thenAnswer(inv -> {
            Car c = inv.getArgument(0);
            c.setId(10L);
            return c;
        });

        Car saved = carService.createCar(validDto);

        assertNotNull(saved.getId());
        assertEquals("1HGCM82633A004352", saved.getVin());
        verify(carRepository).save(any(Car.class));
    }

    @Test
    void createCar_duplicateVin_throws() {
        when(carRepository.existsByVin("1HGCM82633A004352")).thenReturn(true);
        assertThrows(BusinessRuleViolationException.class, () -> carService.createCar(validDto));
        verify(carRepository, never()).save(any());
    }

    @Test
    void createCar_priceAboveMax_throws() {
        validDto.setPrice(new BigDecimal("350000.01"));
        when(carRepository.existsByVin("1HGCM82633A004352")).thenReturn(false);
        assertThrows(BusinessRuleViolationException.class, () -> carService.createCar(validDto));
        verify(carRepository, never()).save(any());
    }

    @Test
    void updateCar_success_withoutChangingVin() {
        when(carRepository.findById(1L)).thenReturn(Optional.of(existing));
        when(carRepository.save(any(Car.class))).thenAnswer(inv -> inv.getArgument(0));

        validDto.setVin(existing.getVin()); // igual VIN
        validDto.setPrice(new BigDecimal("20000.00"));
        Car updated = carService.updateCar(1L, validDto);

        assertEquals(new BigDecimal("20000.00"), updated.getPrice());
        verify(carRepository).save(any(Car.class));
    }

    @Test
    void updateCar_changeVin_throws() {
        when(carRepository.findById(1L)).thenReturn(Optional.of(existing));
        validDto.setVin("5J6RM4H74EL012345"); // distinto VIN
        assertThrows(BusinessRuleViolationException.class, () -> carService.updateCar(1L, validDto));
        verify(carRepository, never()).save(any());
    }

    @Test
    void updateCar_priceAboveMax_throws() {
        when(carRepository.findById(1L)).thenReturn(Optional.of(existing));
        validDto.setVin(existing.getVin());
        validDto.setPrice(new BigDecimal("999999.99"));
        assertThrows(BusinessRuleViolationException.class, () -> carService.updateCar(1L, validDto));
    }

    @Test
    void deleteCar_notExists_throws() {
        when(carRepository.existsById(99L)).thenReturn(false);
        assertThrows(ResourceNotFoundException.class, () -> carService.deleteCar(99L));
    }

    @Test
    void getCarById_notFound_throws() {
        when(carRepository.findById(123L)).thenReturn(Optional.empty());
        assertThrows(ResourceNotFoundException.class, () -> carService.getCarById(123L));
    }
}
