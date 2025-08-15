package com.carfinder.sales.dtos;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import jakarta.validation.constraints.*;
import java.math.BigDecimal;

import io.swagger.v3.oas.annotations.media.Schema;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Schema(description = "Data Transfer Object for Car")
public class CarDTO {

    @Schema(description = "Database ID", example = "101")
    private Long id;

    @Schema(description = "Vehicle Identification Number", example = "1HGCM82633A004352")
    @NotBlank(message = "VIN is required")
    private String vin;

    @Schema(description = "Car manufacturer", example = "Toyota")
    @NotBlank(message = "Make is required")
    private String make;

    @Schema(description = "Car model", example = "Corolla")
    @NotBlank(message = "Model is required")
    private String model;

    @Schema(description = "Car sub-model", example = "EX")
    @NotBlank(message = "SubModel is required")
    private String subModel;

    @Schema(description = "Year of manufacture", example = "2020")
    @NotNull(message = "Year is required")
    @Min(value = 1930, message = "Year must be no earlier than 1930")
    @Max(value = 2026, message = "Year must be no later than 2026")
    private Integer year;

    @Schema(description = "Mileage in kilometers", example = "45000")
    @NotNull(message = "Mileage is required")
    @Min(value = 0, message = "Mileage must be non-negative")
    private Integer mileage;

    @Schema(description = "Color of the car", example = "Red")
    @NotBlank(message = "Color is required")
    private String color;

    @Schema(description = "Transmission type", example = "Automatic")
    @NotBlank(message = "Transmission is required")
    private String transmission;

    @Schema(description = "Price in USD", example = "15000.00")
    @NotNull(message = "Price is required")
    @DecimalMin(value = "5000.0", inclusive = false, message = "Price must be greater than 5000")
    private BigDecimal price;

    @Schema(description = "Image URL", example = "https://example.com/car.jpg")
    @NotBlank(message = "Image URL is required")
    @Pattern(regexp = "^(http|https)://.*$", message = "Image must be a valid URL")
    private String image;
}

