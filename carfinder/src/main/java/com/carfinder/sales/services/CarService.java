package com.carfinder.sales.services;

import com.carfinder.sales.dtos.CarDTO;
import com.carfinder.sales.entities.Car;
import com.carfinder.sales.exceptions.BusinessRuleViolationException;
import com.carfinder.sales.exceptions.CarNotFoundException;
import com.carfinder.sales.exceptions.ResourceNotFoundException;
import com.carfinder.sales.mapper.CarMapper;
import com.carfinder.sales.repositories.CarRepository;

import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.regex.Pattern;

@Service
public class CarService {

    private static final int YEAR_MIN = 1930;
    private static final int YEAR_MAX = 2026;

    private static final BigDecimal PRICE_MIN = new BigDecimal("5000.00");
    private static final BigDecimal PRICE_MAX = new BigDecimal("350000.00");

    // Prohibir I/O/Q en VIN
    private static final Pattern VIN_INVALID = Pattern.compile("[IOQ]", Pattern.CASE_INSENSITIVE);

    @Autowired
    private CarRepository carRepository;

    // -------- Helpers --------
    private static String upper(String s) { return s == null ? null : s.trim().toUpperCase(); }
    private static boolean isBlank(String s) { return s == null || s.trim().isEmpty(); }
    private void require(boolean condition, String message) {
        if (!condition) throw new BusinessRuleViolationException(message);
    }

    /** Valida reglas de negocio y unicidad. Si idForUpdate != null, es edición. */
    private void validateRules(CarDTO dto, Long idForUpdate) {
        // Requeridos (no vacíos)
        require(!isBlank(dto.getVin()),           "VIN cannot be empty.");
        require(!isBlank(dto.getMake()),          "Make cannot be empty.");
        require(!isBlank(dto.getModel()),         "Model cannot be empty.");
        require(!isBlank(dto.getSubModel()),      "Submodel cannot be empty.");
        require(!isBlank(dto.getTransmission()),  "Transmission cannot be empty.");
        require(!isBlank(dto.getColor()),         "Color cannot be empty.");
        require(!isBlank(dto.getImage()),         "Image cannot be empty.");

        // VIN
        String vinNorm = upper(dto.getVin());
        require(!VIN_INVALID.matcher(vinNorm).find(), "VIN cannot contain I, O, or Q.");


        require(dto.getYear() != null, "Year cannot be empty.");
        require(dto.getYear() >= YEAR_MIN && dto.getYear() <= YEAR_MAX,
                "Year must be between " + YEAR_MIN + " and " + YEAR_MAX + ".");


        require(dto.getPrice() != null, "Price cannot be empty.");
        require(dto.getPrice().compareTo(PRICE_MIN) >= 0 && dto.getPrice().compareTo(PRICE_MAX) <= 0,
                "Price must be between " + PRICE_MIN.toPlainString() + " and " + PRICE_MAX.toPlainString() + ".");


        require(dto.getMileage() != null, "Mileage cannot be empty.");

        require(dto.getMileage() >= 0, "Mileage must be >= 0.");


        if (idForUpdate == null) {

            require(!carRepository.existsByVin(vinNorm), "Cannot add car with same VIN.");
        } else {

            require(!carRepository.existsByVinAndIdNot(vinNorm, idForUpdate), "Cannot add car with same VIN.");
        }
    }


    @Transactional
    public Car createCar(CarDTO carDTO) {
        // Validación centralizada (incluye unicidad VIN)
        validateRules(carDTO, null);

        // Normalización y mapeo
        Car car = CarMapper.toEntity(carDTO);
        car.setVin(upper(carDTO.getVin())); // aseguramos mayúsculas

        return carRepository.save(car);
    }

    @Transactional
    public Car updateCar(Long id, CarDTO dto) {
        Car car = carRepository.findById(id)
                .orElseThrow(() -> new CarNotFoundException("Car not found"));

        // Validación centralizada (incluye unicidad VIN excluyendo el propio id)
        validateRules(dto, id);

        // Actualización de campos
        car.setVin(upper(dto.getVin()));
        car.setYear(dto.getYear());
        car.setMake(dto.getMake());
        car.setModel(dto.getModel());
        car.setSubModel(dto.getSubModel());
        car.setMileage(dto.getMileage());
        car.setColor(dto.getColor());
        car.setTransmission(dto.getTransmission());
        car.setPrice(dto.getPrice());
        car.setImage(dto.getImage());

        return carRepository.save(car);
    }

    public void deleteCar(Long id) {
        if (!carRepository.existsById(id)) {
            throw new ResourceNotFoundException("Cannot delete — Car with ID " + id + " does not exist");
        }
        carRepository.deleteById(id);
    }

    public List<Car> getAllCars() {
        return carRepository.findAll();
    }

    public Car getCarById(Long id) {
        return carRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Car with ID " + id + " not found"));
    }

    public boolean existsByVin(String vin) {
        return carRepository.existsByVin(upper(vin));
    }
}
