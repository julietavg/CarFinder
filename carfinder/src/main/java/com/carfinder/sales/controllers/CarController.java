package com.carfinder.sales.controllers;

import com.carfinder.sales.entities.Car;
import com.carfinder.sales.exceptions.BusinessRuleViolationException;
import com.carfinder.sales.mapper.CarMapper;
import com.carfinder.sales.services.CarService;
import com.carfinder.sales.dtos.CarDTO;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.security.access.prepost.PreAuthorize;

@CrossOrigin(
    origins = "http://localhost:5173",
    allowedHeaders = {"Authorization","Content-Type","Accept"},
    methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE, RequestMethod.OPTIONS},
    allowCredentials = "true"
)
@RestController
@RequestMapping("/api/cars")
public class CarController {

    @Autowired
    private CarService carService;

    // CREATE — ADMIN
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public ResponseEntity<?> createCar(@Valid @RequestBody CarDTO carDTO) {
        if (carService.existsByVin(carDTO.getVin())) {
            // 409 por VIN duplicado
            throw new BusinessRuleViolationException("Cannot add car with same VIN.");
        }
        Car car = carService.createCar(carDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(Map.of(
            "message", "Car has been created successfully.",
            "car", CarMapper.toDTO(car)
        ));
    }


    // UPDATE — ADMIN
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}")
    public ResponseEntity<?> updateCar(@PathVariable Long id, @Valid @RequestBody CarDTO carDTO) {
        Car updatedCar = carService.updateCar(id, carDTO);
        return ResponseEntity.ok(Map.of(
            "message", "Car updated successfully",
            "car", CarMapper.toDTO(updatedCar)
        ));
    }

    // DELETE — ADMIN
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteCar(@PathVariable Long id) {
        carService.deleteCar(id);
        return ResponseEntity.ok(Map.of(
                "message", "Car Id " + id + " has been deleted successfully."
        ));
    }

    // LIST — ADMIN o USER
    @PreAuthorize("hasAnyRole('ADMIN', 'USER')")
    @GetMapping
    public ResponseEntity<List<CarDTO>> getAllCars() {
        List<CarDTO> cars = carService.getAllCars()
                .stream()
                .map(CarMapper::toDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(cars);
    }

    // GET BY ID — ADMIN o USER
    @PreAuthorize("hasAnyRole('ADMIN', 'USER')")
    @GetMapping("/{id}")
    public ResponseEntity<CarDTO> getCarById(@PathVariable Long id) {
        Car car = carService.getCarById(id);
        return ResponseEntity.ok(CarMapper.toDTO(car));
    }
}
