package com.solera.carfinder.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class CarController {

    @GetMapping("/hello")
    public String hello() {
        return "Hello World!";
    }
}
