package com.carfinder.sales;

import com.carfinder.sales.entities.Car;
import com.carfinder.sales.repositories.CarRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;

@DataJpaTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE) // if you want MySQL
class CarRepositoryTests {

    @Autowired
    TestEntityManager em;
    @Autowired
    CarRepository repo;

    private Car car(String vin) {
        Car c = new Car();
        c.setVin(vin);
        c.setMake("FORD");
        c.setModel("MUSTANG");
        c.setSubModel("GT");
        c.setYear(2024);
        c.setMileage(1000);
        c.setColor("RED");
        c.setTransmission("Automatic");
        c.setPrice(new java.math.BigDecimal("25000.00"));
        c.setImage("http://example/image.jpg");
        return c;
    }

    @Test
    void existsByVinAndIdNot_false_for_same_id() {
        Car saved = em.persistAndFlush(car("VKNX1234567890123"));
        // should be FALSE when excluding the same id
        assertThat(repo.existsByVinAndIdNot("VKNX1234567890123", saved.getId())).isFalse();
    }

    @Test
    void existsByVin_true_when_present() {
        em.persistAndFlush(car("VKNY1234567890123"));
        assertThat(repo.existsByVin("VKNY1234567890123")).isTrue();
    }
}
