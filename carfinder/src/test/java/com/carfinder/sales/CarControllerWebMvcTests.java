package com.carfinder.sales;

import com.carfinder.sales.controllers.CarController;
import com.carfinder.sales.dtos.CarDTO;
import com.carfinder.sales.entities.Car;
import com.carfinder.sales.services.CarService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Slice test for CarController with Spring Security enabled.
 * NOTE: We serialize DTOs with ObjectMapper to avoid text block issues.
 */
@WebMvcTest(controllers = CarController.class)
@AutoConfigureMockMvc(addFilters = true)
class CarControllerWebMvcTests {

    @Autowired MockMvc mockMvc;

    @Autowired ObjectMapper objectMapper;

    @MockBean CarService carService;

    // ---------- helpers ----------

    private CarDTO dto() {
        CarDTO d = new CarDTO();
        d.setId(1L);
        d.setVin("ABCDEFGH123456789");          // avoid I/O/Q
        d.setYear(2024);
        d.setMake("FORD");
        d.setModel("MUSTANG");
        d.setSubModel("GT");
        d.setTransmission("Automatic");
        d.setMileage(1000);
        d.setColor("Red");
        d.setPrice(new BigDecimal("35000"));
        d.setImage("https://example.com/img");
        return d;
    }

    private Car toEntity(CarDTO d) {
        Car c = new Car();
        c.setId(d.getId());
        c.setVin(d.getVin());
        c.setYear(d.getYear());
        c.setMake(d.getMake());
        c.setModel(d.getModel());
        c.setSubModel(d.getSubModel());
        c.setTransmission(d.getTransmission());
        c.setMileage(d.getMileage());
        c.setColor(d.getColor());
        c.setPrice(d.getPrice());
        c.setImage(d.getImage());
        return c;
    }

    // ---------- tests ----------

    @WithMockUser(roles = {"USER"})
    @Test
    void getAllCars_allowed_for_user() throws Exception {
        when(carService.getAllCars()).thenReturn(List.of());
        mockMvc.perform(get("/api/cars"))
               .andExpect(status().isOk());
    }

    @WithMockUser(roles = {"USER"})
    @Test
    void post_forbidden_for_user() throws Exception {
        var body = dto();
        mockMvc.perform(post("/api/cars")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(body)))
               .andExpect(status().isForbidden());
    }

    @WithMockUser(roles = {"ADMIN"})
    @Test
    void post_duplicate_vin_returns_409_body() throws Exception {
        var body = dto();
        // The controller checks service.existsByVin() before calling create
        when(carService.existsByVin(body.getVin())).thenReturn(true);

        mockMvc.perform(post("/api/cars")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(body)))
               .andExpect(status().isConflict())
               .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON))
               .andExpect(jsonPath("$.message").value("Car with VIN already exists."));
    }

    @WithMockUser(roles = {"ADMIN"})
    @Test
    void put_ok_returns_message_and_car() throws Exception {
        var body = dto();
        var savedEntity = toEntity(body);

        when(carService.updateCar(eq(1L), any(CarDTO.class))).thenReturn(savedEntity);

        mockMvc.perform(put("/api/cars/{id}", 1L)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(body)))
               .andExpect(status().isOk())
               .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON))
               .andExpect(jsonPath("$.message").value("Car updated successfully"))
               .andExpect(jsonPath("$.car.vin").value("ABCDEFGH123456789"))
               .andExpect(jsonPath("$.car.make").value("FORD"));
    }

    @WithMockUser(roles = {"ADMIN"})
    @Test
    void delete_ok_returns_message() throws Exception {
        mockMvc.perform(delete("/api/cars/{id}", 1L))
               .andExpect(status().isOk())
               .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON))
               .andExpect(jsonPath("$.message").exists());
    }
}
