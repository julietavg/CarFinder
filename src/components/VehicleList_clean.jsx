import React, { useState, useEffect, useMemo } from 'react';
import '../styles/components/VehicleList.css';
import Particles from './Particles';
import VehicleDetails from './VehicleDetails';
import VehicleForm from './VehicleForm';
import Navigation from './Navigation';
import FilterPanel from './FilterPanel';
import VehicleCard from './VehicleCard';
import { mockVehicles } from '../data/mockVehicles';

const VehicleList = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imageErrors, setImageErrors] = useState({});
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [editingVehicle, setEditingVehicle] = useState(null);
  // filteredVehicles ahora será derivado vía useMemo
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
    // Simulación de fetch reutilizando mockVehicles centralizados
    let timer;
    try {
      setLoading(true);
      timer = setTimeout(() => {
        setVehicles(mockVehicles);
        setLoading(false);
      }, 800);
    } catch (err) {
      setError('Error al cargar los vehículos');
      setLoading(false);
    }
    return () => { if (timer) clearTimeout(timer); };
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

  const filteredVehicles = useMemo(() => {
    if (vehicles.length === 0) return [];
    return sortVehicles(
      applyFilters(vehicles, activeFilters, searchQuery),
      sortOption
    );
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

  // Se elimina renderVehicleCard local en favor de <VehicleCard /> memoizado

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
            {filteredVehicles.map((vehicle, index) => (
              <VehicleCard
                key={vehicle.id}
                vehicle={{
                  ...vehicle,
                  image: imageErrors[vehicle.id]
                    ? 'https://via.placeholder.com/400x200/1a1a1a/ffffff?text=Image+Not+Found'
                    : vehicle.image
                }}
                index={index}
                onView={(v) => setSelectedVehicle(v)}
                onEdit={(v) => handleEdit(v)}
                onDelete={(id) => handleDelete(id)}
                onImageError={handleImageError}
              />
            ))}
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
