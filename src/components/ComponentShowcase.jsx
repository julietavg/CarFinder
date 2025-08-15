import React, { useState, useEffect } from 'react';
import FilterPanel from './FilterPanel';
import SearchResults from './SearchResults';
import VehicleDetailsModal from './VehicleDetailsModal';
import Navigation from './Navigation';
import '../styles/components/ComponentShowcase.css';

// Mock data for demonstration purposes
const MOCK_VEHICLES = [
  {
    id: 1,
    make: 'TOYOTA',
    model: 'CAMRY',
    year: 2022,
    price: 28500,
    mileage: 12500,
    transmission: 'Automatic',
    fuelType: 'Gasoline',
    exteriorColor: 'Silver',
    interiorColor: 'Black',
    description: "This Toyota Camry is in excellent condition with low mileage. It features a comfortable interior, great fuel economy, and Toyota's renowned reliability.",
    image: 'https://via.placeholder.com/800x600?text=Toyota+Camry',
    features: ['Bluetooth', 'Navigation', 'Backup Camera', 'Heated Seats', 'Sunroof'],
    vin: 'JT2BF22K1W0123456',
    stockNumber: 'TC2022-123',
  },
  {
    id: 2,
    make: 'HONDA',
    model: 'ACCORD',
    year: 2021,
    price: 26900,
    mileage: 18200,
    transmission: 'Automatic',
    fuelType: 'Hybrid',
    exteriorColor: 'Blue',
    interiorColor: 'Gray',
    description: 'This Honda Accord Hybrid offers excellent fuel efficiency and a smooth ride. Well-maintained with all service records available.',
    image: 'https://via.placeholder.com/800x600?text=Honda+Accord',
    features: ['Apple CarPlay', 'Android Auto', 'Leather Seats', 'Lane Assist', 'Adaptive Cruise Control'],
    vin: '1HGCM82633A123456',
    stockNumber: 'HA2021-456',
  },
  {
    id: 3,
    make: 'FORD',
    model: 'MUSTANG',
    year: 2023,
    price: 45600,
    mileage: 5600,
    transmission: 'Manual',
    fuelType: 'Gasoline',
    exteriorColor: 'Red',
    interiorColor: 'Black',
    description: 'Experience the thrill of driving with this powerful Ford Mustang. This sports car delivers exhilarating performance with its powerful engine and responsive handling.',
    image: 'https://via.placeholder.com/800x600?text=Ford+Mustang',
    features: ['Leather Seats', 'Bluetooth', 'Navigation', 'Premium Sound System', 'Backup Camera', 'Heated Seats'],
    vin: '1FA6P8TH1L5123456',
    stockNumber: 'FM2023-789',
  },
  {
    id: 4,
    make: 'BMW',
    model: '3 SERIES',
    year: 2022,
    price: 52300,
    mileage: 9800,
    transmission: 'Automatic',
    fuelType: 'Gasoline',
    exteriorColor: 'Black',
    interiorColor: 'Tan',
    description: 'Luxury and performance come together in this BMW 3 Series. Enjoy premium features, exceptional handling, and the prestige of the BMW brand.',
    image: 'https://via.placeholder.com/800x600?text=BMW+3+Series',
    features: ['Leather Seats', 'Navigation', 'Sunroof', 'Heated Seats', 'Premium Sound System', 'Bluetooth'],
    vin: 'WBA5B3C54GD123456',
    stockNumber: 'BM2022-321',
  },
  {
    id: 5,
    make: 'CHEVROLET',
    model: 'EQUINOX',
    year: 2021,
    price: 27500,
    mileage: 22400,
    transmission: 'Automatic',
    fuelType: 'Gasoline',
    exteriorColor: 'White',
    interiorColor: 'Gray',
    description: 'This Chevrolet Equinox SUV offers ample space for passengers and cargo. Perfect for families or anyone needing versatility in their vehicle.',
    image: 'https://via.placeholder.com/800x600?text=Chevrolet+Equinox',
    features: ['Bluetooth', 'Backup Camera', 'Remote Start', 'Apple CarPlay', 'Android Auto'],
    vin: '2GNFLFEK1G6123456',
    stockNumber: 'CE2021-654',
  },
  {
    id: 6,
    make: 'AUDI',
    model: 'A4',
    year: 2023,
    price: 48900,
    mileage: 7200,
    transmission: 'Automatic',
    fuelType: 'Gasoline',
    exteriorColor: 'Gray',
    interiorColor: 'Black',
    description: "Experience luxury and performance with this Audi A4. Featuring premium materials, advanced technology, and Audi's signature Quattro all-wheel drive system.",
    image: 'https://via.placeholder.com/800x600?text=Audi+A4',
    features: ['Leather Seats', 'Navigation', 'Sunroof', 'Heated Seats', 'Premium Sound System', 'Bluetooth', 'Backup Camera'],
    vin: 'WAUENAF47JN123456',
    stockNumber: 'AA2023-987',
  },
  {
    id: 7,
    make: 'DODGE',
    model: 'CHALLENGER',
    year: 2022,
    price: 43200,
    mileage: 11500,
    transmission: 'Automatic',
    fuelType: 'Gasoline',
    exteriorColor: 'Orange',
    interiorColor: 'Black',
    description: 'This Dodge Challenger combines retro-inspired design with modern performance. Its powerful engine delivers an exhilarating driving experience.',
    image: 'https://via.placeholder.com/800x600?text=Dodge+Challenger',
    features: ['Leather Seats', 'Navigation', 'Bluetooth', 'Backup Camera', 'Premium Sound System'],
    vin: '2C3CDZBT1MH123456',
    stockNumber: 'DC2022-234',
  },
  {
    id: 8,
    make: 'TOYOTA',
    model: 'RAV4',
    year: 2023,
    price: 36700,
    mileage: 6300,
    transmission: 'Automatic',
    fuelType: 'Hybrid',
    exteriorColor: 'Green',
    interiorColor: 'Black',
    description: 'This Toyota RAV4 Hybrid delivers excellent fuel efficiency without sacrificing performance. Perfect for eco-conscious drivers who need the versatility of an SUV.',
    image: 'https://via.placeholder.com/800x600?text=Toyota+RAV4',
    features: ['Bluetooth', 'Navigation', 'Backup Camera', 'Apple CarPlay', 'Android Auto', 'Heated Seats'],
    vin: 'JTMW1RFV8LD123456',
    stockNumber: 'TR2023-567',
  },
];

const ComponentShowcase = () => {
  const [selectedFilters, setSelectedFilters] = useState(null);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Handle filter changes
  const handleFilterChange = (filters) => {
    console.log('Filters applied:', filters);
    setSelectedFilters(filters);
  };

  // Open vehicle details modal
  const handleViewVehicleDetails = (vehicle) => {
    setSelectedVehicle(vehicle);
    setIsModalOpen(true);
  };

  // Close vehicle details modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  // Add click handlers to the SearchResults component
  useEffect(() => {
    const vehicleCards = document.querySelectorAll('.vehicle-card');
    vehicleCards.forEach((card, index) => {
      const viewDetailsBtn = card.querySelector('.view-details-btn');
      if (viewDetailsBtn) {
        viewDetailsBtn.addEventListener('click', () => {
          handleViewVehicleDetails(MOCK_VEHICLES[index]);
        });
      }
      
      // Make the whole card clickable
      card.addEventListener('click', (e) => {
        // Avoid triggering when clicking on buttons
        if (!e.target.closest('button')) {
          handleViewVehicleDetails(MOCK_VEHICLES[index]);
        }
      });
    });
    
    return () => {
      vehicleCards.forEach((card, index) => {
        const viewDetailsBtn = card.querySelector('.view-details-btn');
        if (viewDetailsBtn) {
          viewDetailsBtn.removeEventListener('click', () => {
            handleViewVehicleDetails(MOCK_VEHICLES[index]);
          });
        }
        
        card.removeEventListener('click', () => {
          handleViewVehicleDetails(MOCK_VEHICLES[index]);
        });
      });
    };
  }, [selectedFilters]); // Re-add listeners when filters change

  return (
    <>
      <Navigation />
      <div className="showcase-container">
        <div className="showcase-header">
          <h1>CarFinder - Find Your Perfect Vehicle</h1>
          <p>Explore our comprehensive vehicle inventory with advanced filtering capabilities to find exactly what you're looking for.</p>
        </div>
      
      <div className="showcase-actions">
        <div className="showcase-left-actions">
          <FilterPanel onFilterChange={handleFilterChange} />
        </div>
        <div className="showcase-right-actions">
          {/* Add more actions here as needed */}
        </div>
      </div>
      
      <div className="showcase-content">
        <div className="search-wrapper">
          <SearchResults filters={selectedFilters} vehicles={MOCK_VEHICLES} />
        </div>
      </div>
      
      {selectedVehicle && (
        <VehicleDetailsModal 
          vehicle={selectedVehicle}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
        />
      )}
    </div>
    </>
  );
};

export default ComponentShowcase;
