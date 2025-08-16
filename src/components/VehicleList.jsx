import React, { useState, useEffect, useMemo, useCallback } from 'react';
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
  const [sortOption, setSortOption] = useState('price-low');
  const [activeFilters, setActiveFilters] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Mock data - in production this would come from an API
  const mockVehicles = [
    { id: 1, make: 'FORD', model: 'MUSTANG', year: 2019, submodel: 'CLASSIC', price: 150000, image: 'https://images.unsplash.com/photo-1581650107963-3e8c1f48241b?q=80&w=1000&auto=format&fit=crop' },
    { id: 2, make: 'CHEVROLET', model: 'CAMARO', year: 2020, submodel: 'SS', price: 130000, image: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=1000&auto=format&fit=crop' },
    { id: 3, make: 'DODGE', model: 'CHALLENGER', year: 2021, submodel: 'SRT', price: 175000, image: 'https://images.unsplash.com/photo-1588127333419-b9d7de223dcf?q=80&w=1000&auto=format&fit=crop' },
    { id: 4, make: 'PORSCHE', model: '911', year: 2022, submodel: 'CARRERA', price: 220000, image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=1000&auto=format&fit=crop' },
    { id: 5, make: 'TOYOTA', model: 'COROLLA', year: 2023, submodel: 'LE', price: 45000, image: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?q=80&w=1000&auto=format&fit=crop' },
    { id: 6, make: 'BMW', model: 'M3', year: 2022, submodel: 'COMPETITION', price: 180000, image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?q=80&w=1000&auto=format&fit=crop' },
    { id: 7, make: 'MERCEDES', model: 'C-CLASS', year: 2021, submodel: 'AMG', price: 195000, image: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?q=80&w=1000&auto=format&fit=crop' },
    { id: 8, make: 'AUDI', model: 'A4', year: 2020, submodel: 'PREMIUM', price: 85000, image: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?q=80&w=1000&auto=format&fit=crop' }
  ];

  const handleImageError = useCallback((vehicleId) => {
    setImageErrors(prev => ({ ...prev, [vehicleId]: true }));
  }, []);

  const handleVehicleAction = useCallback((action, vehicleId = null, vehicleData = null) => {
    const vehicle = vehicles.find(v => v.id === vehicleId);
    
    switch (action) {
      case 'view':
        setSelectedVehicle(vehicle);
        break;
      case 'edit':
        setEditingVehicle(vehicle);
        break;
      case 'add':
        setEditingVehicle(null);
        break;
      case 'delete':
        if (window.confirm('Are you sure you want to delete this vehicle?')) {
          setVehicles(prev => prev.filter(v => v.id !== vehicleId));
        }
        break;
      case 'save':
        if (vehicleData.id && vehicles.some(v => v.id === vehicleData.id)) {
          setVehicles(prev => prev.map(v => v.id === vehicleData.id ? vehicleData : v));
        } else {
          setVehicles(prev => [vehicleData, ...prev]);
        }
        setEditingVehicle(null);
        break;
      case 'close':
        setSelectedVehicle(null);
        setEditingVehicle(null);
        break;
    }
  }, [vehicles]);

  const resetFilters = useCallback(() => {
    setActiveFilters(null);
    setSearchQuery('');
    window.sessionStorage.removeItem('carfinder-search');
  }, []);

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        setLoading(true);
        setTimeout(() => {
          setVehicles(mockVehicles);
          setLoading(false);
        }, 1500);
      } catch (err) {
        setError('Could not load the list. Please try again.');
        setLoading(false);
      }
    };
    fetchVehicles();
  }, []);

  useEffect(() => {
    const initialSearch = window.sessionStorage.getItem('carfinder-search');
    if (initialSearch) setSearchQuery(initialSearch);
  }, []);

  // Memoized filtered and sorted vehicles
  const filteredVehicles = useMemo(() => {
    if (vehicles.length === 0) return [];

    let result = [...vehicles];
    
    // Apply search filter
    if (searchQuery?.trim()) {
      const query = searchQuery.toLowerCase().trim();
      result = result.filter(vehicle => 
        vehicle.make.toLowerCase().includes(query) ||
        vehicle.model.toLowerCase().includes(query) ||
        vehicle.year.toString().includes(query) ||
        vehicle.submodel?.toLowerCase().includes(query)
      );
    }
    
    // Apply filters
    if (activeFilters) {
      result = result.filter(vehicle => 
        vehicle.price >= activeFilters.priceRange[0] && 
        vehicle.price <= activeFilters.priceRange[1] &&
        vehicle.year >= activeFilters.years[0] && 
        vehicle.year <= activeFilters.years[1] &&
        (activeFilters.makes.length === 0 || activeFilters.makes.includes(vehicle.make)) &&
        (activeFilters.models.length === 0 || activeFilters.models.includes(vehicle.model))
      );
    }
    
    // Apply sorting
    const sortFunctions = {
      'newest': (a, b) => b.year - a.year,
      'oldest': (a, b) => a.year - b.year,
      'price-low': (a, b) => a.price - b.price,
      'price-high': (a, b) => b.price - a.price
    };
    
    if (sortFunctions[sortOption]) {
      result.sort(sortFunctions[sortOption]);
    }
    
    return result;
  }, [vehicles, sortOption, activeFilters, searchQuery]);

  // Render functions
  const renderNoResults = () => (
    <div className="no-vehicles">
      <div className="no-results-icon">
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="8" y1="12" x2="16" y2="12"></line>
        </svg>
      </div>
      <h2>No matching vehicles found</h2>
      <p>{searchQuery ? `No results found for "${searchQuery}". Try a different search term or adjust your filters.` : 'Try adjusting your search filters to find what you\'re looking for.'}</p>
      <button className="clear-filters-btn" onClick={resetFilters}>
        {searchQuery ? 'Clear Search & Filters' : 'Clear All Filters'}
      </button>
    </div>
  );

  const renderVehicleCard = (vehicle, index) => (
    <div className="vehicle-card" key={vehicle.id} style={{animationDelay: `${index * 0.15}s`}}>
      <div className="vehicle-image-container">
        <img 
          src={imageErrors[vehicle.id] ? `https://via.placeholder.com/400x220/1a1a1a/ffffff?text=${vehicle.make}+${vehicle.model}` : vehicle.image}
          alt={`${vehicle.make} ${vehicle.model}`} 
          className="vehicle-image"
          onError={() => handleImageError(vehicle.id)}
        />
      </div>
      <div className="vehicle-info">
        <div className="vehicle-details">
          <h3>{vehicle.make}-{vehicle.model} {vehicle.year}</h3>
          <h4 className="vehicle-submodel">{vehicle.submodel}</h4>
          <p className="vehicle-price">${vehicle.price.toLocaleString()}.00</p>
        </div>
        <div className="vehicle-actions">
          {['view', 'edit', 'delete'].map((action, idx) => (
            <button 
              key={action}
              className={`action-btn ${action === 'view' ? 'details-btn' : action === 'edit' ? 'edit-btn' : 'delete-btn'}`}
              onClick={() => handleVehicleAction(action, vehicle.id)}
              style={{animationDelay: `${0.6 + index * 0.15 + idx * 0.1}s`}}
            >
              {action === 'view' ? 'View Details' : action === 'edit' ? 'Edit' : 'Delete'}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  if (loading) return <div className="vehicle-list-container"><Particles /><Navigation onSearch={setSearchQuery} /><main className="vehicle-list-content"><div className="loading-message">Loading vehicles...</div></main></div>;
  if (error) return <div className="vehicle-list-container"><Particles /><Navigation onSearch={setSearchQuery} /><main className="vehicle-list-content"><div className="error-message">{error}</div></main></div>;

  return (
    <div className="vehicle-list-container">
      <Particles />
  <Navigation onSearch={setSearchQuery} onAddVehicle={() => handleVehicleAction('add')} />
      
      {selectedVehicle && (
        <VehicleDetails 
          vehicle={selectedVehicle}
          onClose={() => handleVehicleAction('close')}
        />
      )}
      
      {editingVehicle !== null && (
        <VehicleForm
          vehicle={editingVehicle}
          onClose={() => handleVehicleAction('close')}
          onSave={(data) => handleVehicleAction('save', null, data)}
        />
      )}
      
      <main className="vehicle-list-content">
        <div className="vehicle-controls">
          <FilterPanel onFilterChange={setActiveFilters} />
          
          {searchQuery && (
            <div className="active-search">
              <span>Search results for: <strong>"{searchQuery}"</strong></span>
              <button onClick={() => { setSearchQuery(''); window.sessionStorage.removeItem('carfinder-search'); }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
          )}
          
          {filteredVehicles.length > 0 && (
            <div className="sort-controls">
              <label htmlFor="sort-select">Sort by price:</label>
              <select id="sort-select" onChange={(e) => setSortOption(e.target.value)} value={sortOption} className="sort-select">
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>
          )}
        </div>

        {filteredVehicles.length === 0 ? renderNoResults() : (
          <>
            <div className="vehicle-grid">
              {filteredVehicles.map(renderVehicleCard)}
            </div>
            <div className="add-vehicle-container">
              <button className="add-vehicle-btn" onClick={() => handleVehicleAction('add')}>
                Add new vehicle
              </button>
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default VehicleList;
