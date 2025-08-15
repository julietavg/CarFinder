import React, { useState, useEffect } from 'react';
import '../styles/components/SearchResults.css';

const SearchResults = ({ filters, vehicles }) => {
  const [filteredVehicles, setFilteredVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [sortOption, setSortOption] = useState('relevance');
  const [page, setPage] = useState(1);
  const itemsPerPage = 12;

  // Apply filters and sorting
  useEffect(() => {
    setLoading(true);
    
    // Simulate API call delay
    setTimeout(() => {
      let results = [...vehicles];
      
      // Apply filters if they exist
      if (filters) {
        // Filter by price range
        if (filters?.priceRange && filters.priceRange.length === 2) {
          results = results.filter(vehicle => 
            vehicle.price >= filters.priceRange[0] && vehicle.price <= filters.priceRange[1]
          );
        }
        
        // Filter by year range
        if (filters?.years && filters.years.length === 2) {
          results = results.filter(vehicle => 
            vehicle.year >= filters.years[0] && vehicle.year <= filters.years[1]
          );
        }
        
        // Filter by makes
        if (filters?.makes && filters.makes.length > 0) {
          results = results.filter(vehicle => 
            filters.makes.includes(vehicle.make)
          );
        }
        
        // Filter by models
        if (filters?.models && filters.models.length > 0) {
          results = results.filter(vehicle => 
            filters.models.includes(vehicle.model)
          );
        }
        
        // Filter by features
        if (filters?.features && filters.features.length > 0) {
          results = results.filter(vehicle => {
            // Check if vehicle has all selected features
            return filters.features.every(feature =>
              vehicle.features?.includes(feature)
            );
          });
        }
      }
      
      // Apply sorting
      switch (sortOption) {
        case 'price-low':
          results.sort((a, b) => a.price - b.price);
          break;
        case 'price-high':
          results.sort((a, b) => b.price - a.price);
          break;
        case 'year-new':
          results.sort((a, b) => b.year - a.year);
          break;
        case 'year-old':
          results.sort((a, b) => a.year - b.year);
          break;
        case 'relevance':
        default:
          // Default sorting (could be based on other factors)
          break;
      }
      
      setFilteredVehicles(results);
      setLoading(false);
    }, 800); // Simulate API call delay
    
  }, [vehicles, filters, sortOption]);

  const handleSortChange = (e) => {
    setSortOption(e.target.value);
  };

  const handleViewToggle = (mode) => {
    setViewMode(mode);
  };

  const handleLoadMore = () => {
    setPage(page + 1);
  };

  // Format currency
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(price);
  };

  // Calculate displayed vehicles based on pagination
  const displayedVehicles = filteredVehicles.slice(0, page * itemsPerPage);
  const hasMore = displayedVehicles.length < filteredVehicles.length;

  // Placeholder for empty state
  if (!loading && filteredVehicles.length === 0) {
    return (
      <div className="search-results-container">
        <div className="search-header">
          <h2>Search Results</h2>
          <span className="search-count">0 vehicles found</span>
        </div>
        
        <div className="search-empty">
          <svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" fill="currentColor" viewBox="0 0 16 16">
            <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
          </svg>
          <h3>No vehicles found</h3>
          <p>We couldn't find any vehicles matching your search criteria. Try adjusting your filters.</p>
          <button onClick={() => window.location.reload()}>Reset All Filters</button>
        </div>
      </div>
    );
  }

  return (
    <div className="search-results-container">
      <div className="search-header">
        <div>
          <h2>Search Results</h2>
          {!loading && (
            <span className="search-count">{filteredVehicles.length} vehicles found</span>
          )}
        </div>
        
        <div className="search-options">
          <select
            className="sort-select"
            value={sortOption}
            onChange={handleSortChange}
            aria-label="Sort vehicles"
          >
            <option value="relevance">Sort by: Relevance</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="year-new">Year: Newest First</option>
            <option value="year-old">Year: Oldest First</option>
          </select>
          
          <div className="view-toggle">
            <button 
              className={viewMode === 'grid' ? 'active' : ''} 
              onClick={() => handleViewToggle('grid')}
              aria-label="Grid view"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                <path d="M1 2.5A1.5 1.5 0 0 1 2.5 1h3A1.5 1.5 0 0 1 7 2.5v3A1.5 1.5 0 0 1 5.5 7h-3A1.5 1.5 0 0 1 1 5.5v-3zm8 0A1.5 1.5 0 0 1 10.5 1h3A1.5 1.5 0 0 1 15 2.5v3A1.5 1.5 0 0 1 13.5 7h-3A1.5 1.5 0 0 1 9 5.5v-3zm-8 8A1.5 1.5 0 0 1 2.5 9h3A1.5 1.5 0 0 1 7 10.5v3A1.5 1.5 0 0 1 5.5 15h-3A1.5 1.5 0 0 1 1 13.5v-3zm8 0A1.5 1.5 0 0 1 10.5 9h3a1.5 1.5 0 0 1 1.5 1.5v3a1.5 1.5 0 0 1-1.5 1.5h-3A1.5 1.5 0 0 1 9 13.5v-3z"/>
              </svg>
            </button>
            <button 
              className={viewMode === 'list' ? 'active' : ''} 
              onClick={() => handleViewToggle('list')}
              aria-label="List view"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                <path fillRule="evenodd" d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5z"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
      
      {loading ? (
        <div className="search-loading">
          <div className="search-loading-spinner"></div>
        </div>
      ) : (
        <>
          <div className={`search-results ${viewMode}-view`}>
            {displayedVehicles.map((vehicle) => (
              <div key={vehicle.id} className="vehicle-card">
                <div className="vehicle-image">
                  <img 
                    src={vehicle.image} 
                    alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://via.placeholder.com/300x200?text=No+Image';
                    }}
                  />
                </div>
                <div className="vehicle-info">
                  <div className="vehicle-details">
                    <h3>{vehicle.year} {vehicle.make} {vehicle.model}</h3>
                    <div className="vehicle-meta">
                      <span>{vehicle.mileage.toLocaleString()} miles</span>
                      <span>{vehicle.transmission}</span>
                      <span>{vehicle.fuelType}</span>
                    </div>
                  </div>
                  
                  {viewMode === 'list' && (
                    <div className="vehicle-features">
                      {vehicle.features && vehicle.features.slice(0, 4).map((feature, index) => (
                        <span key={index} className="feature-tag">{feature}</span>
                      ))}
                    </div>
                  )}
                  
                  <div className="vehicle-price">
                    <span className="price">{formatPrice(vehicle.price)}</span>
                    <button className="view-details-btn">View Details</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {hasMore && (
            <div className="load-more">
              <button onClick={handleLoadMore}>
                Load More Results
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default SearchResults;
