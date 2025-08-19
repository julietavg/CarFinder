USE carfinder;

CREATE TABLE cars (
    id BIGINT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    vin VARCHAR(17) NOT NULL UNIQUE,
    year YEAR NOT NULL,
    make VARCHAR(50) NOT NULL,
    model VARCHAR(50) NOT NULL,
    sub_model VARCHAR(50) NOT NULL,
    price DECIMAL(10,2) NOT NULL CHECK (price >= 5000),
    mileage INT NOT NULL,
    color VARCHAR(30) NOT NULL,
    transmission VARCHAR(30) NOT NULL,
    image VARCHAR(255) NOT NULL
);

INSERT INTO cars (vin, year, make, model, sub_model, price, mileage, color, transmission, image) VALUES
('1HGCM82633A004352', 2020, 'Honda', 'Civic', 'EX', 18280, 15000, 'Red', 'Automatic', 'https://file.kelleybluebookimages.com/kbb/base/evox/CP/13528/2020-Honda-Civic-front_13528_032_2400x1800_RC.png'),
('1FAFP404X1F192837', 2019, 'Ford', 'Mustang', 'GT', 24950, 22000, 'Red', 'Manual', 'https://www.motorcarclassics.com/galleria_images/607/607_main_l.jpg'),
('2T1BURHE5JC123456', 2021, 'Toyota', 'Corolla', 'LE', 19000, 12000, 'White', 'Automatic', 'https://file.kelleybluebookimages.com/kbb/base/evox/CP/13488/2021-Toyota-Corolla-front_13488_032_1809x771_1F7_cropped.png'),
('3VW2B7AJ5HM123789', 2018, 'Volkswagen', 'Jetta', 'SE', 10000, 30000, 'Gray', 'Automatic', 'https://media.ed.edmunds-media.com/volkswagen/jetta/2018/oem/2018_volkswagen_jetta_sedan_14t-wolfsburg-edition_fq_oem_2_1280x855.jpg'),
('5NPE24AF4FH123321', 2022, 'Hyundai', 'Sonata', 'SEL', 22300, 8000, 'Blue', 'Automatic', 'https://file.kelleybluebookimages.com/kbb/base/evox/CP/14242/2022-Hyundai-Sonata-front_14242_032_1844x733_ST2_cropped.png'),
('1C4RJFBG8FC123654', 2020, 'Jeep', 'Grand Cherokee', 'Limited', 23500, 18000, 'Black', 'Automatic', 'https://www.edmunds.com/assets/m/jeep/grand-cherokee/2019/oem/2019_jeep_grand-cherokee_4dr-suv_limited-x_fq_oem_1_815.jpg'),
('1GCHK23U53F123987', 2021, 'Chevrolet', 'Silverado', 'LTZ', 43750, 10000, 'Gray', 'Automatic', 'https://file.kelleybluebookimages.com/kbb/base/evox/CP/12995/2021-Chevrolet-Silverado%201500%20Crew%20Cab-front_12995_032_1839x840_G9K_cropped.png'),
('JHMFA16586S123963', 2019, 'Honda', 'Accord', 'Sport', 21920, 25000, 'Blue', 'Automatic', 'https://file.kelleybluebookimages.com/kbb/base/evox/CP/12415/2019-Honda-Accord-front_12415_032_1812x734_BS_cropped.png'),
('WBA3A5C56DF123741', 2022, 'BMW', '3 Series', '330i', 29070, 5000, 'Red', 'Automatic', 'https://file.kelleybluebookimages.com/kbb/base/evox/CP/14447/2022-BMW-3%20Series-front_14447_032_1848x760_A75_cropped.png'),
('SALWR2VF4FA123852', 2023, 'Land Rover', 'Range Rover Sport', 'HSE', 98000, 3000, 'Red', 'Automatic', 'https://hips.hearstapps.com/hmg-prod/images/2023-land-rover-range-rover-sport-first-edition-101-1663595727.jpg'),
('1HGCM82633A004353',	2021,	'Honda',	'CR-V',	'EX-L',	24500,	12000,	'Silver',	'Automatic',	'https://di-honda-enrollment.s3.amazonaws.com/2021/model-pages/crv/trims/touring.jpg'),
('1FAFP404X1F192838',	2020,	'Ford',	'Explorer',	'XLT',	19750,	18000,	'Black',	'Automatic',	'https://pictures.dealer.com/j/jackdemmerwaynefordfd/1005/974d1233ad195b0bee6bf117057afa80x.jpg'),
('2T1BURHE5JC123457',	2022,	'Toyota',	'Camry',	'SE',	24230,	9000,	'Gray',	'Automatic',	'https://platform.cstatic-images.com/in/v2/stock_photos/efc2df08-a513-4caa-ab68-6310da6e72ff/d9e3b2c0-552e-4764-ba72-ba207220d907.png'),
('3VW2B7AJ5HM123790',	2021,	'Volkswagen',	'Passat',	'R-Line',	17850,	11000,	'Black',	'Automatic',	'https://cdn.jdpower.com/Models/640x480/2021-Volkswagen-Passat-2-0TR-Line.jpg'),
('5NPE24AF4FH123322',	2023,	'Hyundai',	'Elantra',	'N Line',	24000,	5000,	'Blue',	'Automatic',	'https://media.motorfuse.com/img.cfm/type/3/img/0F16CD4A4F06DDD3C0E6ADC6C52C0010F5CB41'),
('1C4RJFBG8FC123655',	2021,	'Jeep',	'Wrangler',	'Sahara',	40875,	15000,	'White',	'Manual',	'https://www.jeep.com/content/dam/fca-brands/na/jeep/en_us/2025/wrangler/gallery/desktop/my25-jeep-wrangler-gallery-01-exterior-desktop.jpg'),
('1GCHK23U53F123988',	2022,	'Chevrolet',	'Tahoe',	'Premier',	58000,	7000,	'Gray',	'Automatic',	'https://tuagenciadelrio.com/wp-content/uploads/2024/06/Marfil-Metalico.jpg'),
('WBA3A5C56DF123742',	2023,	'BMW',	'X5',	'xDrive40i',	45930,	4000,	'White',	'Automatic',	'https://di-uploads-pod23.dealerinspire.com/bmwofowingsmills/uploads/2023/02/2023-x5.jpg'),
('SALWR2VF4FA123853',	2024,	'Land Rover',	'Defender',	'SE',	63250,	2000,	'White',	'Automatic',	'https://assets.config.landrover.com/lr/l663/k25/model/model_l663_k25_a-xdyn-se_a-90_gl.jpg'),
('JHMFA16586S123964',	2022,	'Honda',	'Pilot',	'Touring',	34920,	8000,	'Gray',	'Automatic',	'https://hondaaeropuerto.mx/assets/img/modelos/pilot/versiones/pilotblack.png');
