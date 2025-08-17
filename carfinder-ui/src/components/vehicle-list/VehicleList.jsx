import React, { useState, useEffect } from 'react';
import { useVehicles } from '../../hooks/useVehicles';
import PropTypes from 'prop-types';
import "../../styles/components/VehicleList.css";
import Particles from './Particles';
import VehicleDetails from '../vehicle/VehicleDetails';
import VehicleForm from '../vehicle/VehicleForm';
import Navigation from "../Navigation/Navigation";
import FilterPanel from '../vehicle/FilterPanel';
import ConfirmationModal from '../vehicle/ConfirmationModal';

const VehicleList = ({ onLogout }) => {
  const {
    vehicles,
    loading,
    error,
    addVehicle,
    updateVehicle,
    deleteVehicle
  } = useVehicles();
  const [imageErrors, setImageErrors] = useState({});
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false); /* triggered only from navbar now */
  const [editingVehicle, setEditingVehicle] = useState(null);
  const [filteredVehicles, setFilteredVehicles] = useState([]);
  const [sortOption, setSortOption] = useState('price-low');
  const [activeFilters, setActiveFilters] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [vehicleToDelete, setVehicleToDelete] = useState(null);
  const [savedVehicles, setSavedVehicles] = useState(() => {
    try { return JSON.parse(window.localStorage.getItem('carfinder-saved')||'[]'); } catch { return []; }
  });
  const [viewSavedOnly, setViewSavedOnly] = useState(false);

  const isSaved = (id) => savedVehicles.includes(id);
  const toggleSaveVehicle = (id) => {
    setSavedVehicles(prev => {
      const next = prev.includes(id) ? prev.filter(v => v !== id) : [...prev, id];
      try { window.localStorage.setItem('carfinder-saved', JSON.stringify(next)); } catch {}
      return next;
    });
  };

  const handleImageError = (vehicleId) => {
    setImageErrors(prev => ({
      ...prev,
      [vehicleId]: true
    }));
  };

  // Opening add form now only via navbar's onAddVehicle prop
  const openAddForm = () => setShowAddForm(true);
  
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

  // Vehicles are now fetched via useVehicles hook

  // Inicializar búsqueda desde sessionStorage al montar
  useEffect(() => {
    const initialSearch = window.sessionStorage.getItem('carfinder-search');
    if (initialSearch) setSearchQuery(initialSearch);
  }, []);

  // Antes se controlaba la visibilidad con el scroll; ahora se mantiene siempre visible.
  // (Si quisieras volver al comportamiento anterior, reintroduce el effect eliminado.)

  const scrollToTop = () => {
    // Detecta el elemento que realmente está haciendo scroll
    const candidates = [
      document.scrollingElement,
      document.documentElement,
      document.body
    ].filter(Boolean);
    // Elige el que tenga scrollHeight mayor que clientHeight
    const target = candidates.find(el => el.scrollHeight > el.clientHeight) || document.documentElement;
    try {
      target.scrollTo({ top: 0, behavior: 'smooth' });
    } catch {
      target.scrollTop = 0; // fallback sin smooth
    }
    // Fallback extra si algún navegador ignora smooth
    setTimeout(() => {
      if (target.scrollTop > 0) {
        target.scrollTop = 0;
        document.body.scrollTop = 0; // Safari antiguo
      }
    }, 600);
  };

  // Efecto para aplicar filtros, búsqueda y ordenación
  useEffect(() => {
    if (vehicles.length > 0) {
      // Empezamos con todos los vehículos
      let result = [...vehicles];
      
      // Aplicar filtro de búsqueda si existe
      if (searchQuery && searchQuery.trim() !== '') {
        const query = searchQuery.toLowerCase().trim();
        result = result.filter(vehicle => 
          vehicle.make.toLowerCase().includes(query) ||
          vehicle.model.toLowerCase().includes(query) ||
          vehicle.year.toString().includes(query) ||
          (vehicle.submodel?.toLowerCase().includes(query))
        );
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
      // Mostrar solo guardados si está activo el modo
      if (viewSavedOnly) {
        result = result.filter(v => savedVehicles.includes(v.id));
      }
      
      setFilteredVehicles(result);
    }
  }, [vehicles, sortOption, activeFilters, searchQuery, viewSavedOnly, savedVehicles]);

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
    const vehicle = filteredVehicles.find(v => v.id === vehicleId);
    if (vehicle) {
      setVehicleToDelete(vehicle);
      setShowDeleteConfirmation(true);
    }
  };

  const confirmDelete = () => {
    if (vehicleToDelete) {
      setVehicles(vehicles.filter(vehicle => vehicle.id !== vehicleToDelete.id));
      setVehicleToDelete(null);
    }
  };

  const cancelDelete = () => {
    setShowDeleteConfirmation(false);
    setVehicleToDelete(null);
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
  
  // Función para reiniciar los filtros y búsquedas
  const resetFilters = () => {
    setActiveFilters(null);
    setSearchQuery('');
    window.sessionStorage.removeItem('carfinder-search');
  };

  let content;
  if (loading) {
    content = (
      <div className="loading-overlay" role="status" aria-live="polite">
        <div className="spinner-orbit">
          <span></span><span></span><span></span>
          <div className="spinner-core"></div>
        </div>
        <div className="loading-copy">
          <h2>Loading inventory</h2>
          <div className="loading-bar"><i /></div>
          <p>Preparing vehicles...</p>
        </div>
      </div>
    );
  } else if (error) {
    content = (
      <div className="error-message">
        {error}
      </div>
    );
  } else {
    content = (
      <>
        {/* Panel de filtros siempre visible */}
        <div className="vehicle-controls">
          <FilterPanel onFilterChange={handleFilterChange} vehicles={vehicles} />
          
          {/* Mostrar término de búsqueda si está activo */}
          {searchQuery && (
            <div className="active-search">
              <span>Search results for: <strong>"{searchQuery}"</strong></span>
              <button onClick={() => { setSearchQuery(''); window.sessionStorage.removeItem('carfinder-search'); }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
          )}
          
          {filteredVehicles.length > 0 && (
            <div className="sort-controls">
              <label htmlFor="sort-select">Sort by price:</label>
              <select 
                id="sort-select" 
                onChange={handleSortChange} 
                value={sortOption}
                className="sort-select"
              >
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
            {viewSavedOnly ? (
              <>
                <h2>No saved vehicles yet</h2>
                <p>You haven't added any favorites yet. Browse the inventory and click the star icon to save vehicles.</p>
                <button className="clear-filters-btn" onClick={() => setViewSavedOnly(false)}>Browse Inventory</button>
              </>
            ) : searchQuery ? (
              <>
                <h2>No results for "{searchQuery}"</h2>
                <p>Prueba otro término o ajusta los filtros.</p>
                <button className="clear-filters-btn" onClick={resetFilters}>Clear Search & Filters</button>
              </>
            ) : (
              <>
                <h2>No vehicles match current filters</h2>
                <p>Ajusta los filtros o limpia para ver todo el inventario.</p>
                <button className="clear-filters-btn" onClick={resetFilters}>Clear Filters</button>
              </>
            )}
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
                    <button
                      type="button"
                      className={`favorite-toggle ${isSaved(vehicle.id) ? 'saved' : ''}`}
                      aria-label={isSaved(vehicle.id) ? 'Remove from saved vehicles' : 'Save vehicle'}
                      onClick={(e) => { e.stopPropagation(); toggleSaveVehicle(vehicle.id); }}
                    >
                      <span className="favorite-pulse" />
                      {isSaved(vehicle.id) ? (
                        <svg viewBox="0 0 24 24" fill="currentColor" stroke="none">
                          <path d="M12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.62L12 2 9.19 8.62 2 9.24l5.46 4.73L5.82 21z" />
                        </svg>
                      ) : (
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                          <polygon points="12 2 9.19 8.63 2 9.24 7.46 13.97 5.82 21 12 17.27 18.18 21 16.54 13.97 22 9.24 14.81 8.63 12 2" />
                        </svg>
                      )}
                    </button>
                  </div>
                  <div className="vehicle-info">
                    <div className="vehicle-details">
                      <h3>{vehicle.make}-{vehicle.model} {vehicle.year}</h3>
                      <h4 className="vehicle-submodel">{vehicle.submodel}</h4>
                      <p className="vehicle-price">${vehicle.price.toLocaleString()}.00</p>
                    </div>
                    
                    <div className="vehicle-actions">
                      <button 
                        className="action-btn details-btn" 
                        onClick={() => handleViewDetails(vehicle.id)}
                        style={{animationDelay: `${0.6 + index * 0.15}s`}}
                      >
                        View Details
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
            {/* Bottom add button removed; add via navbar */}
          </>
        )}
      </>
    );
  }

  return (
    <div className="vehicle-list-container">
      <Particles />
  <Navigation
    onSearch={(q) => setSearchQuery(q)}
    onAddVehicle={openAddForm}
    onShowSaved={() => setViewSavedOnly(true)}
    onBrowse={() => setViewSavedOnly(false)}
    showSaved={viewSavedOnly}
  onLogout={onLogout}
  />
      
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

      <ConfirmationModal
        show={showDeleteConfirmation}
        onClose={cancelDelete}
        onConfirm={confirmDelete}
        title="Delete Vehicle"
        message={`Are you sure you want to delete this vehicle? This action cannot be undone.${vehicleToDelete ? `\n\n${vehicleToDelete.make} ${vehicleToDelete.model} ${vehicleToDelete.year}` : ''}`}
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
      />
      
      <main className="vehicle-list-content">
        {content}
      </main>
      <button
        type="button"
        className="scroll-top-btn visible"
        aria-label="Scroll to top"
        onClick={scrollToTop}
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="18 15 12 9 6 15" />
        </svg>
      </button>
    </div>
  );
};

export default VehicleList;

VehicleList.propTypes = {
  onLogout: PropTypes.func,
};