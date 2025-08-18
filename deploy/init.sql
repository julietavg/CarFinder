-- Create the cars table if it doesn't exist
CREATE TABLE IF NOT EXISTS cars (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    VIN VARCHAR(17) NOT NULL UNIQUE,
    Year INT NOT NULL,
    Make VARCHAR(50) NOT NULL,
    Model VARCHAR(50) NOT NULL,
    Sub_Model VARCHAR(50),
    Price DECIMAL(10,2) NOT NULL,
    Mileage INT NOT NULL,
    Color VARCHAR(30) NOT NULL,
    Transmission VARCHAR(20) NOT NULL,
    Image TEXT
);

-- Insert sample data
USE carfinder;
INSERT INTO cars (VIN, Year, Make, Model, Sub_Model, Price, Mileage, Color, Transmission, Image) VALUES
('1HGCM82633A004352', 2020, 'Honda', 'Civic', 'EX', 22000.00, 15000, 'Red', 'Automatic', 'https://file.kelleybluebookimages.com/kbb/base/evox/CP/13528/2020-Honda-Civic-front_13528_032_2400x1800_RC.png'),
('1FAFP404X1F192837', 2019, 'Ford', 'Mustang', 'GT', 35000.00, 22000, 'Red', 'Manual', 'https://www.motorcarclassics.com/galleria_images/607/607_main_l.jpg'),
('2T1BURHE5JC123456', 2021, 'Toyota', 'Corolla', 'LE', 19500.00, 12000, 'White', 'Automatic', 'https://file.kelleybluebookimages.com/kbb/base/evox/CP/13488/2021-Toyota-Corolla-front_13488_032_1809x771_1F7_cropped.png'),
('3VW2B7AJ5HM123789', 2018, 'Volkswagen', 'Jetta', 'SE', 18000.00, 30000, 'Gray', 'Automatic', 'https://media.ed.edmunds-media.com/volkswagen/jetta/2018/oem/2018_volkswagen_jetta_sedan_14t-wolfsburg-edition_fq_oem_2_1280x855.jpg'),
('5NPE24AF4FH123321', 2022, 'Hyundai', 'Sonata', 'SEL', 25000.00, 8000, 'Blue', 'Automatic', 'https://file.kelleybluebookimages.com/kbb/base/evox/CP/14242/2022-Hyundai-Sonata-front_14242_032_1844x733_ST2_cropped.png'),
('1C4RJFBG8FC123654', 2020, 'Jeep', 'Grand Cherokee', 'Limited', 37000.00, 18000, 'Black', 'Automatic', 'https://www.edmunds.com/assets/m/jeep/grand-cherokee/2019/oem/2019_jeep_grand-cherokee_4dr-suv_limited-x_fq_oem_1_815.jpg'),
('1GCHK23U53F123987', 2021, 'Chevrolet', 'Silverado', 'LTZ', 42000.00, 10000, 'Gray', 'Automatic', 'https://file.kelleybluebookimages.com/kbb/base/evox/CP/12995/2021-Chevrolet-Silverado%201500%20Crew%20Cab-front_12995_032_1839x840_G9K_cropped.png'),
('JHMFA16586S123963', 2019, 'Honda', 'Accord', 'Sport', 24000.00, 25000, 'Blue', 'Automatic', 'https://file.kelleybluebookimages.com/kbb/base/evox/CP/12415/2019-Honda-Accord-front_12415_032_1812x734_BS_cropped.png'),
('WBA3A5C56DF123741', 2022, 'BMW', '3 Series', '330i', 45000.00, 5000, 'Red', 'Automatic', 'https://file.kelleybluebookimages.com/kbb/base/evox/CP/14447/2022-BMW-3%20Series-front_14447_032_1848x760_A75_cropped.png'),
('SALWR2VF4FA123852', 2023, 'Land Rover', 'Range Rover Sport', 'HSE', 78000.00, 3000, 'Red', 'Automatic', 'https://hips.hearstapps.com/hmg-prod/images/2023-land-rover-range-rover-sport-first-edition-101-1663595727.jpg'),
('1HGCM82633A004353', 2021, 'Honda', 'CR-V', 'EX-L', 28000.00, 12000, 'Silver', 'Automatic', 'https://file.kelleybluebookimages.com/kbb/base/evox/CP/13529/2021-Honda-CR-V-front_13529_032_2400x1800_RC.png'),
('1FAFP404X1F192838', 2020, 'Ford', 'Explorer', 'XLT', 32000.00, 18000, 'Black', 'Automatic', 'https://file.kelleybluebookimages.com/kbb/base/evox/CP/14042/2020-Ford-Explorer-front_14042_032_2400x1800_RC.png'),
('2T1BURHE5JC123457', 2022, 'Toyota', 'Camry', 'SE', 27000.00, 9000, 'Gray', 'Automatic', 'https://file.kelleybluebookimages.com/kbb/base/evox/CP/13489/2022-Toyota-Camry-front_13489_032_2400x1800_RC.png'),
('3VW2B7AJ5HM123790', 2021, 'Volkswagen', 'Passat', 'R-Line', 26000.00, 11000, 'White', 'Automatic', 'https://file.kelleybluebookimages.com/kbb/base/evox/CP/13942/2021-Volkswagen-Passat-front_13942_032_2400x1800_RC.png'),
('5NPE24AF4FH123322', 2023, 'Hyundai', 'Elantra', 'N Line', 24000.00, 5000, 'Blue', 'Automatic', 'https://file.kelleybluebookimages.com/kbb/base/evox/CP/14243/2023-Hyundai-Elantra-front_14243_032_2400x1800_RC.png'),
('1C4RJFBG8FC123655', 2021, 'Jeep', 'Wrangler', 'Sahara', 39000.00, 15000, 'Green', 'Manual', 'https://file.kelleybluebookimages.com/kbb/base/evox/CP/12416/2021-Jeep-Wrangler-front_12416_032_2400x1800_RC.png'),
('1GCHK23U53F123988', 2022, 'Chevrolet', 'Tahoe', 'Premier', 58000.00, 7000, 'Black', 'Automatic', 'https://file.kelleybluebookimages.com/kbb/base/evox/CP/12996/2022-Chevrolet-Tahoe-front_12996_032_2400x1800_RC.png'),
('WBA3A5C56DF123742', 2023, 'BMW', 'X5', 'xDrive40i', 62000.00, 4000, 'White', 'Automatic', 'https://file.kelleybluebookimages.com/kbb/base/evox/CP/14448/2023-BMW-X5-front_14448_032_2400x1800_RC.png'),
('SALWR2VF4FA123853', 2024, 'Land Rover', 'Defender', 'SE', 69000.00, 2000, 'Silver', 'Automatic', 'https://hips.hearstapps.com/hmg-prod/images/2024-land-rover-defender-110-front-1676400000.jpg'),
('JHMFA16586S123964', 2022, 'Honda', 'Pilot', 'Touring', 42000.00, 8000, 'Gray', 'Automatic', 'https://file.kelleybluebookimages.com/kbb/base/evox/CP/13530/2022-Honda-Pilot-front_13530_032_2400x1800_RC.png')
ON DUPLICATE KEY UPDATE
    Year = VALUES(Year),
    Make = VALUES(Make),
    Model = VALUES(Model),
    Sub_Model = VALUES(Sub_Model),
    Price = VALUES(Price),
    Mileage = VALUES(Mileage),
    Color = VALUES(Color),
    Transmission = VALUES(Transmission),
    Image = VALUES(Image);
