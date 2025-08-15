import React, { useState, useEffect } from 'react';
import '../styles/components/VehicleList.css';
import Particles from './Particles';
import VehicleDetails from './VehicleDetails';
import VehicleForm from './VehicleForm';
import Navigation from './Navigation';
import FilterPanel from './FilterPanel';

const VehicleList = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imageErrors, setImageErrors] = useState({});
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [editingVehicle, setEditingVehicle] = useState(null);
  const [filteredVehicles, setFilteredVehicles] = useState([]);
  const [sortOption, setSortOption] = useState('price-low');
  const [activeFilters, setActiveFilters] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const handleImageError = (vehicleId) => {
    setImageErrors(prev => ({
      ...prev,
      [vehicleId]: true
    }));
  };
  
  const handleSaveVehicle = (vehicleData) => {
    if (vehicleData.id && vehicles.some(v => v.id === vehicleData.id)) {
      // Editing existing vehicle
      setVehicles(prevVehicles => 
        prevVehicles.map(v => v.id === vehicleData.id ? vehicleData : v)
      );
    } else {
      // Adding new vehicle
      setVehicles(prevVehicles => [vehicleData, ...prevVehicles]);
    }
    
    setEditingVehicle(null);
  };

  useEffect(() => {
    // Simulamos la carga de datos
    const fetchVehicles = async () => {
      try {
        setLoading(true);
        // Simular llamada a la API
        setTimeout(() => {
          // Datos de ejemplo con rangos de precios más diversos
          const mockVehicles = [
            {
              id: 1,
              make: 'FORD',
              model: 'MUSTANG',
              year: 2019,
              submodel: 'CLASSIC',
              price: 150000,
              image: 'https://images.unsplash.com/photo-1581650107963-3e8c1f48241b?q=80&w=1000&auto=format&fit=crop'
            },
            {
              id: 2,
              make: 'CHEVROLET',
              model: 'CAMARO',
              year: 2020,
              submodel: 'SS',
              price: 130000,
              image: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=1000&auto=format&fit=crop'
            },
            {
              id: 3,
              make: 'DODGE',
              model: 'CHALLENGER',
              year: 2021,
              submodel: 'SRT',
              price: 175000,
              image: 'https://images.unsplash.com/photo-1588127333419-b9d7de223dcf?q=80&w=1000&auto=format&fit=crop'
            },
            {
              id: 4,
              make: 'PORSCHE',
              model: '911',
              year: 2022,
              submodel: 'CARRERA',
              price: 220000,
              image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=1000&auto=format&fit=crop'
            },
            {
              id: 5,
              make: 'TOYOTA',
              model: 'COROLLA',
              year: 2023,
              submodel: 'LE',
              price: 45000,
              image: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?q=80&w=1000&auto=format&fit=crop'
            },
            {
              id: 6,
              make: 'HONDA',
              model: 'CIVIC',
              year: 2023,
              submodel: 'EX',
              price: 48000,
              image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?q=80&w=1000&auto=format&fit=crop'
            },
            {
              id: 7,
              make: 'BMW',
              model: 'M3',
              year: 2022,
              submodel: 'COMPETITION',
              price: 180000,
              image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?q=80&w=1000&auto=format&fit=crop'
            },
            {
              id: 8,
              make: 'AUDI',
              model: 'A4',
              year: 2023,
              submodel: 'S-LINE',
              price: 95000,
              image: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?q=80&w=1000&auto=format&fit=crop'
            },
            {
              id: 9,
              make: 'MERCEDES',
              model: 'C-CLASS',
              year: 2022,
              submodel: 'AMG',
              price: 120000,
              image: 'https://images.unsplash.com/photo-1617531653332-bd46c24f2068?q=80&w=1000&auto=format&fit=crop'
            },
            {
              id: 10,
              make: 'VOLKSWAGEN',
              model: 'GOLF',
              year: 2023,
              submodel: 'GTI',
              price: 65000,
              image: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?q=80&w=1000&auto=format&fit=crop'
            }
          ];
          
          setVehicles(mockVehicles);
          setFilteredVehicles(mockVehicles);
          setLoading(false);
        }, 1000); // Simular tiempo de carga
      } catch (err) {
        setError('Error al cargar los vehículos');
        setLoading(false);
      }
    };

    fetchVehicles();
  }, []);

  const sortVehicles = (vehicles, option) => {
    const sorted = [...vehicles].sort((a, b) => {
      switch (option) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'year-new':
          return b.year - a.year;
        case 'year-old':
          return a.year - b.year;
        case 'make':
          return a.make.localeCompare(b.make);
        default:
          return 0;
      }
    });
    return sorted;
  };

  const applyFilters = (vehicles, filters, searchQuery) => {
    let filtered = [...vehicles];

    // Aplicar búsqueda por texto
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(vehicle =>
        vehicle.make.toLowerCase().includes(query) ||
        vehicle.model.toLowerCase().includes(query) ||
        vehicle.submodel.toLowerCase().includes(query) ||
        vehicle.year.toString().includes(query)
      );
    }

    // Aplicar filtros de panel
    if (filters) {
      if (filters.make && filters.make.length > 0) {
        filtered = filtered.filter(vehicle => 
          filters.make.includes(vehicle.make)
        );
      }
      
      if (filters.priceRange) {
        filtered = filtered.filter(vehicle => 
          vehicle.price >= filters.priceRange.min && 
          vehicle.price <= filters.priceRange.max
        );
      }
      
      if (filters.yearRange) {
        filtered = filtered.filter(vehicle => 
          vehicle.year >= filters.yearRange.min && 
          vehicle.year <= filters.yearRange.max
        );
      }
    }

    return filtered;
  };

  useEffect(() => {
    if (vehicles.length > 0) {
      const filtered = applyFilters(vehicles, activeFilters, searchQuery);
      const sorted = sortVehicles(filtered, sortOption);
      setFilteredVehicles(sorted);
    }
  }, [vehicles, activeFilters, sortOption, searchQuery]);

  const handleEdit = (vehicle) => {
    setEditingVehicle(vehicle);
  };

  const handleDelete = (vehicleId) => {
    setVehicles(prevVehicles => 
      prevVehicles.filter(vehicle => vehicle.id !== vehicleId)
    );
  };

  const handleSortChange = (option) => {
    setSortOption(option);
  };

  const handleFiltersChange = (filters) => {
    setActiveFilters(filters);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  const renderVehicleCard = (vehicle, index) => (
    <div 
      key={vehicle.id} 
      className="vehicle-card"
      style={{animationDelay: `${index * 0.1}s`}}
    >
      <div className="vehicle-image-container">
        <img 
          src={imageErrors[vehicle.id] ? 'https://via.placeholder.com/400x200/1a1a1a/ffffff?text=Image+Not+Found' : vehicle.image}
          alt={`${vehicle.make} ${vehicle.model}`}
          className="vehicle-image"
          onError={() => handleImageError(vehicle.id)}
        />
        <div className="vehicle-overlay">
          <button 
            className="action-btn view-btn"
            onClick={() => setSelectedVehicle(vehicle)}
            style={{animationDelay: `${0.2 + index * 0.15}s`}}
          >
            View Details
          </button>
          <button 
            className="action-btn edit-btn" 
            onClick={() => handleEdit(vehicle)}
            style={{animationDelay: `${0.5 + index * 0.15}s`}}
          >
            Edit
          </button>
          <button 
            className="action-btn delete-btn" 
            onClick={() => handleDelete(vehicle.id)}
            style={{animationDelay: `${0.8 + index * 0.15}s`}}
          >
            Delete
          </button>
        </div>
      </div>
      <div className="vehicle-info">
        <h3 className="vehicle-title">{vehicle.make} {vehicle.model}</h3>
        <p className="vehicle-subtitle">{vehicle.year} • {vehicle.submodel}</p>
        <p className="vehicle-price">{formatPrice(vehicle.price)}</p>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="vehicle-list-container">
        <Particles />
        <Navigation 
          onSearch={(q) => setSearchQuery(q)} 
          onVehicleAdded={handleSaveVehicle}
        />
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading vehicles...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="vehicle-list-container">
        <Particles />
        <Navigation 
          onSearch={(q) => setSearchQuery(q)} 
          onVehicleAdded={handleSaveVehicle}
        />
        <div className="error-container">
          <h2>Error</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  const content = (
    <>
      {vehicles.length === 0 ? (
        <div className="empty-state">
          <h2>No vehicles found</h2>
          <p>Start by adding your first vehicle.</p>
        </div>
      ) : (
        <>
          <FilterPanel 
            vehicles={vehicles}
            onFiltersChange={handleFiltersChange}
            onSortChange={handleSortChange}
            sortOption={sortOption}
            searchQuery={searchQuery}
          />
          
          <div className="vehicles-grid">
            {filteredVehicles.map((vehicle, index) => renderVehicleCard(vehicle, index))}
          </div>
        </>
      )}
    </>
  );

  return (
    <div className="vehicle-list-container">
      <Particles />
      <Navigation 
        onSearch={(q) => setSearchQuery(q)} 
        onVehicleAdded={handleSaveVehicle}
      />
      
      {selectedVehicle && (
        <VehicleDetails 
          vehicle={selectedVehicle}
          onClose={() => setSelectedVehicle(null)}
        />
      )}
      
      {editingVehicle && (
        <VehicleForm
          vehicle={editingVehicle}
          onClose={() => {
            setEditingVehicle(null);
          }}
          onSave={handleSaveVehicle}
        />
      )}
      
      <main className="vehicle-list-content">
        {content}
      </main>
    </div>
  );
};

export default VehicleList;
