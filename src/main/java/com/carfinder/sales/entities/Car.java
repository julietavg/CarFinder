package com.carfinder.sales.entities;

import com.fasterxml.jackson.annotation.JsonAnyGetter;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "Cars")
public class Car {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String vin;
    private int year;
    private String make;
    private String model;

    @Column(name = "sub_model", nullable = false)
    private String subModel;

    private double price;
    private int mileage;
    private String color;
    private String transmission;
    private String image;
}

