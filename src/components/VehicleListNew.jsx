import React, { useState, useEffect } from 'react';
import './VehicleList.css';
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
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState(null);
  const [filteredVehicles, setFilteredVehicles] = useState([]);
  const [sortOption, setSortOption] = useState('newest');
  const [activeFilters, setActiveFilters] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const handleImageError = (vehicleId) => {
    setImageErrors(prev => ({
      ...prev,
      [vehicleId]: true
    }));
  };

  const handleAddVehicle = () => {
    setShowAddForm(true);
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
    setShowAddForm(false);
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
              make: 'BMW',
              model: 'M3',
              year: 2022,
              submodel: 'COMPETITION',
              price: 180000,
              image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?q=80&w=1000&auto=format&fit=crop'
            },
            {
              id: 7,
              make: 'MERCEDES',
              model: 'C-CLASS',
              year: 2021,
              submodel: 'AMG',
              price: 195000,
              image: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?q=80&w=1000&auto=format&fit=crop'
            },
            {
              id: 8,
              make: 'AUDI',
              model: 'A4',
              year: 2020,
              submodel: 'PREMIUM',
              price: 85000,
              image: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?q=80&w=1000&auto=format&fit=crop'
            }
          ];
          setVehicles(mockVehicles);
          setFilteredVehicles(mockVehicles);
          setLoading(false);
        }, 1500);
      } catch (err) {
        setError('Could not load the list. Please try again.');
        setLoading(false);
      }
    };

    fetchVehicles();
  }, []);

  // Efecto para aplicar búsqueda, filtros y ordenación
  useEffect(() => {
    if (vehicles.length > 0) {
      // Empezamos con todos los vehículos
      let result = [...vehicles];
      // Búsqueda
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase().trim();
        result = result.filter(v => (
          v.make.toLowerCase().includes(q) ||
          v.model.toLowerCase().includes(q) ||
          v.year.toString().includes(q) ||
          (v.submodel && v.submodel.toLowerCase().includes(q))
        ));
      }
      
      // Aplicamos los filtros si existen
      if (activeFilters) {
        // Filtrar por rango de precio
        result = result.filter(vehicle => 
          vehicle.price >= activeFilters.priceRange[0] && 
          vehicle.price <= activeFilters.priceRange[1]
        );
        
        // Filtrar por rango de años
        result = result.filter(vehicle => 
          vehicle.year >= activeFilters.years[0] && 
          vehicle.year <= activeFilters.years[1]
        );
        
        // Filtrar por marcas seleccionadas
        if (activeFilters.makes.length > 0) {
          result = result.filter(vehicle => 
            activeFilters.makes.includes(vehicle.make)
          );
        }
        
        // Filtrar por modelos seleccionados
        if (activeFilters.models.length > 0) {
          result = result.filter(vehicle => 
            activeFilters.models.includes(vehicle.model)
          );
        }
      }
      
      // Ordenar vehículos según la opción seleccionada
      switch (sortOption) {
        case 'newest':
          result.sort((a, b) => b.year - a.year);
          break;
        case 'oldest':
          result.sort((a, b) => a.year - b.year);
          break;
        case 'price-low':
          result.sort((a, b) => a.price - b.price);
          break;
        case 'price-high':
          result.sort((a, b) => b.price - a.price);
          break;
        default:
          break;
      }
      
      setFilteredVehicles(result);
    }
  }, [vehicles, sortOption, activeFilters, searchQuery]);

  const handleViewDetails = (vehicleId) => {
    console.log('View details for vehicle:', vehicleId);
    const vehicle = filteredVehicles.find(v => v.id === vehicleId);
    if (vehicle) {
      setSelectedVehicle(vehicle);
    }
  };

  const handleEdit = (vehicleId) => {
    console.log('Edit vehicle:', vehicleId);
    const vehicle = filteredVehicles.find(v => v.id === vehicleId);
    if (vehicle) {
      setEditingVehicle(vehicle);
    }
  };

  const handleDelete = (vehicleId) => {
    console.log('Delete vehicle:', vehicleId);
    // Aquí iría el modal de confirmación para eliminar
    if (window.confirm('Are you sure you want to delete this vehicle?')) {
      setVehicles(vehicles.filter(vehicle => vehicle.id !== vehicleId));
    }
  };
  
  // Manejar el cambio en la ordenación
  const handleSortChange = (e) => {
    setSortOption(e.target.value);
  };
  
  // Manejar cambios en los filtros
  const handleFilterChange = (filters) => {
    console.log("Applied filters:", filters);
    setActiveFilters(filters);
  };
  
  // Función para reiniciar los filtros
  const resetFilters = () => {
    setActiveFilters(null);
  };

  return (
    <div className="vehicle-list-container">
      <Particles />
  <Navigation onSearch={setSearchQuery} />
      
      {selectedVehicle && (
        <VehicleDetails 
          vehicle={selectedVehicle}
          onClose={() => setSelectedVehicle(null)}
        />
      )}
      
      {(showAddForm || editingVehicle) && (
        <VehicleForm
          vehicle={editingVehicle}
          onClose={() => {
            setShowAddForm(false);
            setEditingVehicle(null);
          }}
          onSave={handleSaveVehicle}
        />
      )}
      
      <main className="vehicle-list-content">
        {loading ? (
          <div className="loading-container">
            <div className="loader"></div>
            <p>Loading vehicles...</p>
          </div>
        ) : error ? (
          <div className="error-message">
            {error}
          </div>
        ) : (
          <>
            {/* Panel de filtros siempre visible */}
            <div className="vehicle-controls">
              <FilterPanel onFilterChange={handleFilterChange} />
              
              {searchQuery && (
                <div className="active-search">
                  <span>Search results for: <strong>"{searchQuery}"</strong></span>
                  <button onClick={() => { setSearchQuery(''); }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                  </button>
                </div>
              )}

              {filteredVehicles.length > 0 && (
                <div className="sort-controls">
                  <div className="search-results-info">
                    {filteredVehicles.length} vehicles found
                  </div>
                  <label htmlFor="sort-select">Sort by:</label>
                  <select 
                    id="sort-select" 
                    onChange={handleSortChange} 
                    value={sortOption}
                    className="sort-select"
                  >
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                  </select>
                </div>
              )}
            </div>

            {/* Mensaje de no resultados o lista de vehículos */}
            {filteredVehicles.length === 0 ? (
              <div className="no-vehicles">
                <div className="no-results-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="8" y1="12" x2="16" y2="12"></line>
                  </svg>
                </div>
                <h2>No matching vehicles found</h2>
                {searchQuery ? (
                  <p>No results for "{searchQuery}". Try another term or clear filters.</p>
                ) : (
                  <p>Try adjusting your search filters to find what you're looking for.</p>
                )}
                <button className="clear-filters-btn" onClick={resetFilters}>
                  {searchQuery ? 'Clear Search & Filters' : 'Clear All Filters'}
                </button>
              </div>
            ) : (
              <>
                <div className="vehicle-grid">
                  {filteredVehicles.map((vehicle, index) => (
                    <div className="vehicle-card" key={vehicle.id} style={{animationDelay: `${index * 0.15}s`}}>
                      <div className="vehicle-image-container">
                        <img 
                          src={imageErrors[vehicle.id] 
                            ? `https://via.placeholder.com/400x220/1a1a1a/ffffff?text=${vehicle.make}+${vehicle.model}` 
                            : vehicle.image} 
                          alt={`${vehicle.make} ${vehicle.model}`} 
                          className="vehicle-image"
                          onError={() => handleImageError(vehicle.id)}
                        />
                      </div>
                      <div className="vehicle-info">
                        <div className="vehicle-title">
                          <span className="vehicle-make">{vehicle.make}</span>
                          <span className="vehicle-model">{vehicle.model} <span className="vehicle-year">{vehicle.year}</span></span>
                          {vehicle.submodel && <span className="vehicle-submodel">{vehicle.submodel}</span>}
                        </div>
                        <div className="vehicle-price-row">
                          <span className="vehicle-price">${vehicle.price.toLocaleString()}</span>
                        </div>
                        <div className="vehicle-actions">
                          <button 
                            className="action-btn details-btn" 
                            onClick={() => handleViewDetails(vehicle.id)}
                            style={{animationDelay: `${0.6 + index * 0.15}s`}}
                          >
                            Details
                          </button>
                          <button 
                            className="action-btn edit-btn" 
                            onClick={() => handleEdit(vehicle.id)}
                            style={{animationDelay: `${0.7 + index * 0.15}s`}}
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
                    </div>
                  ))}
                </div>
                <div className="add-vehicle-container">
                  <button className="add-vehicle-btn" onClick={handleAddVehicle}>
                    Add new vehicle
                  </button>
                </div>
              </>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default VehicleList;
