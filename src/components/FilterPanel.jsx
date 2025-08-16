import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import '../styles/components/FilterPanel.css';

const FilterPanel = ({ onFilterChange, vehicles = [] }) => {
  const [expanded, setExpanded] = useState(false);

  // Derivar catálogos dinámicos desde vehicles
  const derivedMakes = React.useMemo(() => {
    const set = new Set();
    vehicles.forEach(v => { if (v.make) set.add(v.make); });
    return Array.from(set).sort();
  }, [vehicles]);

  const derivedModels = React.useMemo(() => {
    const set = new Set();
    vehicles.forEach(v => { if (v.model) set.add(v.model); });
    return Array.from(set).sort();
  }, [vehicles]);

  const priceBounds = React.useMemo(() => {
    if (!vehicles.length) return { min: 0, max: 300000 };
    let min = Infinity, max = -Infinity;
    vehicles.forEach(v => {
      if (typeof v.price === 'number') {
        if (v.price < min) min = v.price;
        if (v.price > max) max = v.price;
      }
    });
  if (!isFinite(min)) min = 0;
  if (!isFinite(max)) max = 0;
    // Ajuste a múltiplos de 1000 para slider más limpio
    min = Math.floor(min / 1000) * 1000;
    max = Math.ceil(max / 1000) * 1000;
    if (min === max) { min = 0; max = max || 100000; }
    return { min, max };
  }, [vehicles]);

  const yearBounds = React.useMemo(() => {
    if (!vehicles.length) return { min: 1990, max: new Date().getFullYear() };
    let min = Infinity, max = -Infinity;
    vehicles.forEach(v => {
      if (typeof v.year === 'number') {
        if (v.year < min) min = v.year;
        if (v.year > max) max = v.year;
      }
    });
  if (!isFinite(min)) min = 1990;
  if (!isFinite(max)) max = new Date().getFullYear();
    return { min, max };
  }, [vehicles]);

  const [filters, setFilters] = useState({
    priceRange: [priceBounds.min, priceBounds.max],
    years: [yearBounds.min, yearBounds.max],
    makes: [],
    models: []
  });

  // Si cambian los bounds (porque cargaron vehículos) reseteamos rangos manteniendo selecciones de makes/models
  useEffect(() => {
    setFilters(prev => ({
      ...prev,
      priceRange: [priceBounds.min, priceBounds.max],
      years: [yearBounds.min, yearBounds.max]
    }));
  }, [priceBounds.min, priceBounds.max, yearBounds.min, yearBounds.max]);
  
  const filterRef = useRef(null);
  
  // Catálogos disponibles (dinámicos)
  const availableMakes = derivedMakes;
  // Filtrar modelos según makes seleccionados (si hay selección) para UX mejor
  const availableModels = React.useMemo(() => {
    if (filters.makes.length === 0) return derivedModels;
    const set = new Set();
    vehicles.forEach(v => { if (filters.makes.includes(v.make)) set.add(v.model); });
    return Array.from(set).sort();
  }, [derivedModels, filters.makes, vehicles]);
  // Features removidos según solicitud
  
  // Manejar clic fuera del panel para cerrarlo
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setExpanded(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  // Count active filters
  const getActiveFilterCount = () => {
    // Siempre retorna 0 para no mostrar el indicador de filtros activos
    return 0;
    
    /* Código original comentado
    let count = 0;
    
    if (filters.priceRange[0] > 0) count++;
    if (filters.priceRange[1] < 500000) count++;
    if (filters.years[0] > 2000) count++;
    if (filters.years[1] < new Date().getFullYear()) count++;
    if (filters.makes.length > 0) count++;
    if (filters.models.length > 0) count++;
  // features removidos
    
    return count;
    */
  };
  
  const handleToggleExpanded = () => {
    setExpanded(!expanded);
  };
  
  const handlePriceChange = (e, index) => {
    const newValue = parseInt(e.target.value);
    const newPriceRange = [...filters.priceRange];
    
    // Validamos que sea un número válido
    if (!isNaN(newValue)) {
      newPriceRange[index] = newValue;
      
      // Asegurarse de que el rango mínimo sea menor que el máximo
      if (index === 0 && newValue > newPriceRange[1]) {
        newPriceRange[1] = newValue;
      } else if (index === 1 && newValue < newPriceRange[0]) {
        newPriceRange[0] = newValue;
      }
      
      setFilters({
        ...filters,
        priceRange: newPriceRange
      });
    }
  };
  
  const handleYearChange = (e, index) => {
    const newValue = parseInt(e.target.value);
    const newYearRange = [...filters.years];
    newYearRange[index] = newValue;
    
    // Asegurarse de que el año mínimo sea menor que el máximo
    if (index === 0 && newValue > newYearRange[1]) {
      newYearRange[1] = newValue;
    } else if (index === 1 && newValue < newYearRange[0]) {
      newYearRange[0] = newValue;
    }
    
    setFilters({
      ...filters,
      years: newYearRange
    });
  };
  
  const handleCheckboxChange = (e, category, item) => {
    const { checked } = e.target;
    const currentItems = [...filters[category]];
    
    if (checked) {
      setFilters({
        ...filters,
        [category]: [...currentItems, item]
      });
    } else {
      setFilters({
        ...filters,
        [category]: currentItems.filter(i => i !== item)
      });
    }
  };
  
  const handleApplyFilters = () => {
    if (onFilterChange) {
      onFilterChange(filters);
    }
    setExpanded(false);
  };
  
  const handleResetFilters = () => {
    const reset = {
      priceRange: [priceBounds.min, priceBounds.max],
      years: [yearBounds.min, yearBounds.max],
      makes: [],
  models: []
    };
    setFilters(reset);
    if (onFilterChange) onFilterChange(null);
  };
  
  const formatPrice = (value) => {
    return new Intl.NumberFormat('en-US', { 
      style: 'currency', 
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(value);
  };
  
  return (
    <div className={`filter-panel-container ${expanded ? 'expanded' : ''}`} ref={filterRef}>
      <button 
        className="filter-toggle-btn" 
        onClick={handleToggleExpanded}
        aria-expanded={expanded}
        aria-label="Toggle filter panel"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
        </svg>
        <span>Filters</span>
        {getActiveFilterCount() > 0 && (
          <span className="filter-indicator">{getActiveFilterCount()}</span>
        )}
      </button>
      
      <div className="filter-panel">
        <div className="filter-header">
          <h3>Filter Vehicles</h3>
          <button className="close-filter-btn" onClick={handleToggleExpanded} aria-label="Close filters">×</button>
        </div>
        
        <div className="filter-content">
          <div className="filter-section">
            <h4>Price Range</h4>
            <div className="range-inputs">
              <div className="range-input">
                <label htmlFor="min-price">Min</label>
                <input
                  type="range"
                  id="min-price"
                  min={priceBounds.min}
                  max={priceBounds.max}
                  step="5000"
                  value={filters.priceRange[0]}
                  onChange={(e) => handlePriceChange(e, 0)}
                />
                <div className="range-value">{formatPrice(filters.priceRange[0])}</div>
              </div>
              <div className="range-input">
                <label htmlFor="max-price">Max</label>
                <input
                  type="range"
                  id="max-price"
                  min={priceBounds.min}
                  max={priceBounds.max}
                  step="5000"
                  value={filters.priceRange[1]}
                  onChange={(e) => handlePriceChange(e, 1)}
                />
                <div className="range-value">{formatPrice(filters.priceRange[1])}</div>
              </div>
            </div>
          </div>
          
          <div className="filter-section">
            <h4>Year Range</h4>
            <div className="range-inputs">
              <div className="range-input">
                <label htmlFor="min-year">From</label>
                <input
                  type="range"
                  id="min-year"
                  min={yearBounds.min}
                  max={yearBounds.max}
                  step="1"
                  value={filters.years[0]}
                  onChange={(e) => handleYearChange(e, 0)}
                />
                <div className="range-value">{filters.years[0]}</div>
              </div>
              <div className="range-input">
                <label htmlFor="max-year">To</label>
                <input
                  type="range"
                  id="max-year"
                  min={yearBounds.min}
                  max={yearBounds.max}
                  step="1"
                  value={filters.years[1]}
                  onChange={(e) => handleYearChange(e, 1)}
                />
                <div className="range-value">{filters.years[1]}</div>
              </div>
            </div>
          </div>
          
          <div className="filter-section">
            <h4>Make</h4>
            <div className="checkbox-group">
              {availableMakes.map(make => (
                <div className="checkbox-item" key={make}>
                  <input
                    type="checkbox"
                    id={`make-${make}`}
                    checked={filters.makes.includes(make)}
                    onChange={(e) => handleCheckboxChange(e, 'makes', make)}
                  />
                  <label htmlFor={`make-${make}`}>{make}</label>
                </div>
              ))}
            </div>
          </div>
          
          <div className="filter-section">
            <h4>Model</h4>
            <div className="checkbox-group">
              {availableModels.map(model => (
                <div className="checkbox-item" key={model}>
                  <input
                    type="checkbox"
                    id={`model-${model}`}
                    checked={filters.models.includes(model)}
                    onChange={(e) => handleCheckboxChange(e, 'models', model)}
                  />
                  <label htmlFor={`model-${model}`}>{model}</label>
                </div>
              ))}
            </div>
          </div>
          
          {/* Features removidos */}
        </div>
        
        <div className="filter-actions">
          <button className="reset-btn" onClick={handleResetFilters}>Reset Filters</button>
          <button className="apply-btn" onClick={handleApplyFilters}>Apply Filters</button>
        </div>
      </div>
    </div>
  );
};

export default FilterPanel;

FilterPanel.propTypes = {
  onFilterChange: PropTypes.func,
  vehicles: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    make: PropTypes.string,
    model: PropTypes.string,
    year: PropTypes.number,
    price: PropTypes.number
  }))
};
