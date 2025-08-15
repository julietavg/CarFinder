package com.carfinder.sales.controllers;

import com.carfinder.sales.entities.Car;
import com.carfinder.sales.mapper.CarMapper;
import com.carfinder.sales.services.CarService;
import com.carfinder.sales.dtos.CarDTO;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.security.access.prepost.PreAuthorize;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;

@RestController
@RequestMapping("/cars")
public class CarController {

    @Autowired
    private CarService carService;

    // ✅ Create a new car — ADMIN only
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public ResponseEntity<?> createCar(@Valid @RequestBody CarDTO carDTO) {
        Car car = carService.createCar(carDTO);
        return ResponseEntity.status(201).body(Map.of(
                "message", "Car created successfully",
                "car", CarMapper.toDTO(car)
        ));
    }

    // ✅ Update an existing car by ID — ADMIN only
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}")
    public ResponseEntity<?> updateCar(@PathVariable Long id, @Valid @RequestBody CarDTO carDTO) {
        Car updatedCar = carService.updateCar(id, carDTO);
        return ResponseEntity.ok(Map.of(
                "message", "Car updated successfully",
                "car", CarMapper.toDTO(updatedCar)
        ));
    }

    // ✅ Delete a car by ID — ADMIN only
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCar(@PathVariable Long id) {
        carService.deleteCar(id);
        return ResponseEntity.noContent().build();
    }

    // ✅ Get all cars — ADMIN or USER
    @PreAuthorize("hasAnyRole('ADMIN', 'USER')")
    @GetMapping
    public ResponseEntity<List<CarDTO>> getAllCars() {
        List<CarDTO> cars = carService.getAllCars()
                .stream()
                .map(CarMapper::toDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(cars);
    }

    // ✅ Get a car by ID — ADMIN or USER
    @PreAuthorize("hasAnyRole('ADMIN', 'USER')")
    @GetMapping("/{id}")
    public ResponseEntity<CarDTO> getCarById(@PathVariable Long id) {
        Car car = carService.getCarById(id);
        return ResponseEntity.ok(CarMapper.toDTO(car));
    }
}

