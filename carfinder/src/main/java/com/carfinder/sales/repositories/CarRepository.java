package com.carfinder.sales.repositories;

import com.carfinder.sales.entities.Car;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CarRepository extends JpaRepository<Car, Long> {
    boolean existsByVin(String vin);
}

