// src/components/vehicle-list/VehicleList.jsx
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';

import '../../styles/components/VehicleList.css';

import Particles from './Particles';
import VehicleDetails from '../vehicle/VehicleDetails';
import VehicleForm from '../vehicle/VehicleForm';
import Navigation from '../Navigation/Navigation';
import FilterPanel from '../vehicle/FilterPanel';
import ConfirmationModal from '../vehicle/ConfirmationModal';
import SuccessModal from '../feedback/SuccessModal';

const VehicleList = ({ onLogout, isAdmin = false, username = null }) => {
  // Data
  const [vehicles, setVehicles] = useState([]);
  const [filteredVehicles, setFilteredVehicles] = useState([]);

  // UI state
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imageErrors, setImageErrors] = useState({});

  // Panels / dialogs
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState(null);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [vehicleToDelete, setVehicleToDelete] = useState(null);

  // UX helpers
  const [sortOption, setSortOption] = useState('price-low');
  const [activeFilters, setActiveFilters] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewSavedOnly, setViewSavedOnly] = useState(false);

  // Favorites
  const [savedVehicles, setSavedVehicles] = useState(() => {
    try {
      return JSON.parse(window.localStorage.getItem('carfinder-saved') || '[]');
    } catch {
      return [];
    }
  });

  // Success modal
  const [success, setSuccess] = useState({ open: false, title: '', message: '' });

  const isSaved = (id) => savedVehicles.includes(id);
  const toggleSaveVehicle = (id) => {
    setSavedVehicles((prev) => {
      const next = prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id];
      try {
        window.localStorage.setItem('carfinder-saved', JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  const handleImageError = (vehicleId) => {
    setImageErrors((prev) => ({ ...prev, [vehicleId]: true }));
  };

  const openAddForm = () => {
    if (!isAdmin) return;
    setEditingVehicle(null);
    setShowAddForm(true);
  };

  // ===== LOAD FROM BACKEND =====
  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        setLoading(true);
        const res = await axios.get('/cars'); // axios.defaults.baseURL must point to http://localhost:8080/api
        const rows = Array.isArray(res.data) ? res.data : res.data?.data ?? [];
        const normalized = rows.map((c) => ({
          id: c.id,
          vin: c.vin,
          year: c.year,
          make: c.make,
          model: c.model,
          submodel: c.subModel, // backend -> UI
          mileage: c.mileage,
          color: c.color,
          transmission: c.transmission,
          price: Number(c.price),
          image: c.image,
        }));
        setVehicles(normalized);
        setFilteredVehicles(normalized);
        setError(null);
      } catch (err) {
        setError('Could not load the list. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchVehicles();
  }, []);

  // Restore search persisted in session
  useEffect(() => {
    const initialSearch = window.sessionStorage.getItem('carfinder-search');
    if (initialSearch) setSearchQuery(initialSearch);
  }, []);

  // ===== CREATE/UPDATE =====
  const handleSaveVehicle = async (vehicleData) => {
    const payload = {
      id: vehicleData.id ?? null,
      vin: vehicleData.vin,
      year: vehicleData.year,
      make: vehicleData.make,
      model: vehicleData.model,
      subModel: vehicleData.submodel, // UI -> backend
      mileage: vehicleData.mileage,
      color: vehicleData.color,
      transmission: vehicleData.transmission,
      price: vehicleData.price,
      image: vehicleData.image,
    };

    const normalize = (dto) => ({
      id: dto.id,
      vin: dto.vin,
      year: dto.year,
      make: dto.make,
      model: dto.model,
      submodel: dto.subModel,
      mileage: dto.mileage,
      color: dto.color,
      transmission: dto.transmission,
      price: Number(dto.price),
      image: dto.image,
    });

    try {
      const isEdit = vehicleData?.id != null;

      if (isEdit) {
        const res = await axios.put(`/cars/${vehicleData.id}`, payload);
        const dto = res?.data?.car ?? res?.data?.data ?? res?.data;
        const updated = normalize(dto);
        setVehicles((prev) => prev.map((v) => (v.id === updated.id ? updated : v)));
        setSuccess({
          open: true,
          title: 'Success',
          message: `Car Id ${updated.id} has been updated successfully.`,
        });
      } else {
        const res = await axios.post('/cars', payload);
        const dto = res?.data?.car ?? res?.data?.data ?? res?.data;
        const created = normalize(dto);
        setVehicles((prev) => [created, ...prev]);
        setSuccess({
          open: true,
          title: 'Success',
          message: 'Car has been added successfully.',
        });
      }

      setEditingVehicle(null);
      setShowAddForm(false);
      setSelectedVehicle(null);
      setError(null);
    } catch (e) {
      const status = e?.response?.status;
      const msg =
        e?.response?.data?.message ||
        (status === 409 ? 'Cannot add car with same VIN.' : 'Save failed.');
      setError(msg);
      // Re-lanzar para que VehicleForm muestre errores por campo (400)
      throw e;
    }
  };

  // ===== DELETE =====
  const handleDelete = (vehicleId) => {
    const vehicle = filteredVehicles.find((v) => v.id === vehicleId);
    if (vehicle) {
      setVehicleToDelete(vehicle);
      setShowDeleteConfirmation(true);
    }
  };

  const confirmDelete = async () => {
    if (!vehicleToDelete) return;
    try {
      await axios.delete(`/cars/${vehicleToDelete.id}`);
      setVehicles((prev) => prev.filter((v) => v.id !== vehicleToDelete.id));
      setShowDeleteConfirmation(false);
      setSuccess({
        open: true,
        title: 'Success',
        message: `Car Id ${vehicleToDelete.id} has been deleted successfully.`,
      });
      setVehicleToDelete(null);
    } catch (e) {
      setError(e?.response?.data?.message || 'Delete failed.');
    }
  };

  const cancelDelete = () => {
    setShowDeleteConfirmation(false);
    setVehicleToDelete(null);
  };

  // ===== FILTERS / SEARCH / SORT / SAVED =====
  useEffect(() => {
    if (vehicles.length === 0) return;

    let result = [...vehicles];

    if (searchQuery && searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase().trim();
      result = result.filter(
        (vehicle) =>
          vehicle.make.toLowerCase().includes(query) ||
          vehicle.model.toLowerCase().includes(query) ||
          vehicle.year.toString().includes(query) ||
          vehicle.submodel?.toLowerCase().includes(query),
      );
    }

    if (activeFilters) {
      result = result.filter(
        (vehicle) =>
          vehicle.price >= activeFilters.priceRange[0] &&
          vehicle.price <= activeFilters.priceRange[1],
      );
      result = result.filter(
        (vehicle) =>
          vehicle.year >= activeFilters.years[0] &&
          vehicle.year <= activeFilters.years[1],
      );
      if (activeFilters.makes.length > 0) {
        result = result.filter((vehicle) => activeFilters.makes.includes(vehicle.make));
      }
      if (activeFilters.models.length > 0) {
        result = result.filter((vehicle) => activeFilters.models.includes(vehicle.model));
      }
    }

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

    if (viewSavedOnly) {
      result = result.filter((v) => savedVehicles.includes(v.id));
    }

    setFilteredVehicles(result);
  }, [vehicles, sortOption, activeFilters, searchQuery, viewSavedOnly, savedVehicles]);

  const handleViewDetails = (vehicleId) => {
    const vehicle = filteredVehicles.find((v) => v.id === vehicleId);
    if (vehicle) setSelectedVehicle(vehicle);
  };

  const handleEdit = (vehicleId) => {
    if (!isAdmin) return;
    const vehicle = filteredVehicles.find((v) => v.id === vehicleId);
    if (vehicle) setEditingVehicle(vehicle);
  };

  const handleSortChange = (e) => setSortOption(e.target.value);

  const handleFilterChange = (filters) => setActiveFilters(filters);

  const resetFilters = () => {
    setActiveFilters(null);
    setSearchQuery('');
    window.sessionStorage.removeItem('carfinder-search');
  };

  const scrollToTop = () => {
    const candidates = [document.scrollingElement, document.documentElement, document.body].filter(Boolean);
    const target = candidates.find((el) => el.scrollHeight > el.clientHeight) || document.documentElement;
    try {
      target.scrollTo({ top: 0, behavior: 'smooth' });
    } catch {
      target.scrollTop = 0;
    }
    setTimeout(() => {
      if (target.scrollTop > 0) {
        target.scrollTop = 0;
        document.body.scrollTop = 0;
      }
    }, 600);
  };

  // ===== MAIN CONTENT RENDER =====
  let content;
  if (loading) {
    content = (
      <div className="loading-overlay" role="status" aria-live="polite">
        <div className="spinner-orbit">
          <span></span>
          <span></span>
          <span></span>
          <div className="spinner-core"></div>
        </div>
        <div className="loading-copy">
          <h2>Loading inventory</h2>
          <div className="loading-bar">
            <i />
          </div>
          <p>Preparing vehicles...</p>
        </div>
      </div>
    );
  } else if (error) {
    content = <div className="error-message">{error}</div>;
  } else {
    content = (
      <>
        <div className="vehicle-controls">
          <FilterPanel onFilterChange={handleFilterChange} vehicles={vehicles} />

          {searchQuery && (
            <div className="active-search">
              <span>
                Search results for: <strong>"{searchQuery}"</strong>
              </span>
              <button
                onClick={() => {
                  setSearchQuery('');
                  window.sessionStorage.removeItem('carfinder-search');
                }}
                aria-label="Clear search"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
          )}

          {filteredVehicles.length > 0 && (
            <div className="sort-controls">
              <label htmlFor="sort-select">Sort by:</label>
              <select id="sort-select" onChange={handleSortChange} value={sortOption} className="sort-select">
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="newest">Newest</option>
                <option value="oldest">Oldest</option>
              </select>
            </div>
          )}
        </div>

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
                <button className="clear-filters-btn" onClick={() => setViewSavedOnly(false)}>
                  Browse Inventory
                </button>
              </>
            ) : searchQuery ? (
              <>
                <h2>No results for "{searchQuery}"</h2>
                <p>Try another term or adjust filters.</p>
                <button className="clear-filters-btn" onClick={resetFilters}>
                  Clear Search & Filters
                </button>
              </>
            ) : (
              <>
                <h2>No vehicles match current filters</h2>
                <p>Adjust filters or clear to view all inventory.</p>
                <button className="clear-filters-btn" onClick={resetFilters}>
                  Clear Filters
                </button>
              </>
            )}
          </div>
        ) : (
          <div className="vehicle-grid">
            {filteredVehicles.map((vehicle, index) => (
              <div className="vehicle-card" key={vehicle.id} style={{ animationDelay: `${index * 0.15}s` }}>
                <div className="vehicle-image-container">
                  <img
                    src={
                      imageErrors[vehicle.id]
                        ? `https://via.placeholder.com/400x220/1a1a1a/ffffff?text=${vehicle.make}+${vehicle.model}`
                        : vehicle.image
                    }
                    alt={`${vehicle.make} ${vehicle.model}`}
                    className="vehicle-image"
                    onError={() => handleImageError(vehicle.id)}
                  />
                  <button
                    type="button"
                    className={`favorite-toggle ${isSaved(vehicle.id) ? 'saved' : ''}`}
                    aria-label={isSaved(vehicle.id) ? 'Remove from saved vehicles' : 'Save vehicle'}
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleSaveVehicle(vehicle.id);
                    }}
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
                    <h3>
                      {vehicle.make}-{vehicle.model} {vehicle.year}
                    </h3>
                    <h4 className="vehicle-submodel">{vehicle.submodel}</h4>
                    <p className="vehicle-price">${vehicle.price.toLocaleString()}.00</p>
                  </div>

                  <div className="vehicle-actions">
                    <button
                      className="action-btn details-btn"
                      onClick={() => handleViewDetails(vehicle.id)}
                      style={{ animationDelay: `${0.6 + index * 0.15}s` }}
                    >
                      View Details
                    </button>

                    {isAdmin && (
                      <>
                        <button
                          className="action-btn edit-btn"
                          onClick={() => handleEdit(vehicle.id)}
                          style={{ animationDelay: `${0.7 + index * 0.15}s` }}
                        >
                          Edit
                        </button>
                        <button
                          className="action-btn delete-btn"
                          onClick={() => handleDelete(vehicle.id)}
                          style={{ animationDelay: `${0.8 + index * 0.15}s` }}
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </>
    );
  }

  return (
    <div className="vehicle-list-container">
      <Particles />

      <Navigation
        onSearch={(q) => setSearchQuery(q)}
        onAddVehicle={isAdmin ? openAddForm : undefined}
        onShowSaved={() => setViewSavedOnly(true)}
        onBrowse={() => setViewSavedOnly(false)}
        showSaved={viewSavedOnly}
        onLogout={onLogout}
        isAdmin={isAdmin}
        username={username}
      />

      {selectedVehicle && (
        <VehicleDetails vehicle={selectedVehicle} onClose={() => setSelectedVehicle(null)} />
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
        message={`Are you sure you want to delete this vehicle? This action cannot be undone.${
          vehicleToDelete ? `\n\n${vehicleToDelete.make} ${vehicleToDelete.model} ${vehicleToDelete.year}` : ''
        }`}
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
      />

      <SuccessModal
        open={success.open}
        title={success.title}
        message={success.message}
        onClose={() => setSuccess({ open: false, title: '', message: '' })}
      />

      <main className="vehicle-list-content">{content}</main>

      <button
        type="button"
        className="scroll-top-btn visible"
        aria-label="Scroll to top"
        onClick={scrollToTop}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="18 15 12 9 6 15" />
        </svg>
      </button>
    </div>
  );
};

VehicleList.propTypes = {
  onLogout: PropTypes.func,
  isAdmin: PropTypes.bool,
  username: PropTypes.string,
};

export default VehicleList;
