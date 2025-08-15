package com.carfinder.sales.services;

import com.carfinder.sales.dtos.CarDTO;
import com.carfinder.sales.entities.Car;
import com.carfinder.sales.exceptions.ResourceNotFoundException;
import com.carfinder.sales.mapper.CarMapper;
import com.carfinder.sales.repositories.CarRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class CarService {

    @Autowired
    private CarRepository carRepository;

    // ✅ Create a new car
    public Car createCar(CarDTO carDTO) {
        Car car = CarMapper.toEntity(carDTO);
        return carRepository.save(car);
    }

    // ✅ Update an existing car by ID
    public Car updateCar(Long id, CarDTO carDTO) {
        Car existingCar = carRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Car not found with id: " + id));

        existingCar.setMake(carDTO.getMake());
        existingCar.setModel(carDTO.getModel());
        existingCar.setSubModel(carDTO.getSubModel());
        existingCar.setYear(carDTO.getYear());
        existingCar.setColor(carDTO.getColor());
        existingCar.setMileage(carDTO.getMileage());
        existingCar.setTransmission(carDTO.getTransmission());
        existingCar.setPrice(carDTO.getPrice().doubleValue());
        existingCar.setImage(carDTO.getImage());

        return carRepository.save(existingCar);
    }

    // ✅ Delete a car by ID
    public void deleteCar(Long id) {
        if (!carRepository.existsById(id)) {
            throw new ResourceNotFoundException("Cannot delete — Car with ID " + id + " does not exist");
        }
        carRepository.deleteById(id);
    }

    // ✅ Get all cars
    public List<Car> getAllCars() {
        return carRepository.findAll();
    }

    // ✅ Get a car by ID
    public Car getCarById(Long id) {
        return carRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Car with ID " + id + " not found"));
    }
}
