package com.carfinder.sales.entities;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Table(name = "cars", uniqueConstraints = @UniqueConstraint(columnNames = "vin"))
public class Car {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(length = 17, nullable = false)
    private String vin;

    @Column(nullable = false)
    private Integer year;

    @Column(nullable = false)
    private String make;

    @Column(nullable = false)
    private String model;

    @Column(name = "sub_model", nullable = false)
    private String subModel;

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal price;

    @Column(nullable = false)
    private Integer mileage;

    @Column(nullable = false)
    private String color;

    @Column(nullable = false)
    private String transmission;

    @Column(nullable = false)
    private String image;
}

