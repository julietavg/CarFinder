package com.carfinder.sales.mapper;

import com.carfinder.sales.dtos.CarDTO;
import com.carfinder.sales.entities.Car;

public class CarMapper {
    public static CarDTO toDTO(Car car) {
        CarDTO dto = new CarDTO();
        dto.setId(car.getId());
        dto.setVin(car.getVin());
        dto.setMake(car.getMake());
        dto.setModel(car.getModel());
        dto.setSubModel(car.getSubModel());
        dto.setYear(car.getYear());
        dto.setColor(car.getColor());
        dto.setMileage(car.getMileage());
        dto.setTransmission(car.getTransmission());
        dto.setPrice(car.getPrice());
        dto.setImage(car.getImage());
        return dto;
    }

    public static Car toEntity(CarDTO dto) {
        Car car = new Car();
        car.setId(dto.getId());
        car.setVin(dto.getVin().toUpperCase()); // normalize VIN to uppercase
        car.setMake(dto.getMake());
        car.setModel(dto.getModel());
        car.setSubModel(dto.getSubModel());
        car.setYear(dto.getYear());
        car.setColor(dto.getColor());
        car.setMileage(dto.getMileage());
        car.setTransmission(dto.getTransmission());
        car.setPrice(dto.getPrice());
        car.setImage(dto.getImage());
        return car;
    }
}

