package com.carfinder.sales.mapper;

import com.carfinder.sales.dtos.CarDTO;
import com.carfinder.sales.entities.Car;
import java.math.BigDecimal;

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
        dto.setPrice(BigDecimal.valueOf(car.getPrice())); // Convert double to BigDecimal
        dto.setImage(car.getImage());
        return dto;
    }

    public static Car toEntity(CarDTO dto) {
        Car car = new Car();
        car.setId(dto.getId());
        car.setVin(dto.getVin());
        car.setMake(dto.getMake());
        car.setModel(dto.getModel());
        car.setSubModel(dto.getSubModel());
        car.setYear(dto.getYear());
        car.setColor(dto.getColor());
        car.setMileage(dto.getMileage());
        car.setTransmission(dto.getTransmission());
        car.setPrice(dto.getPrice().doubleValue());
        car.setImage(dto.getImage());
        return car;
    }
}

