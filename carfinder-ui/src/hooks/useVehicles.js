import { useState, useEffect, useMemo } from 'react';
import axios from 'axios';

// Custom hook for vehicle data management
export const useVehicles = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Map frontend vehicle object to backend DTO keys
  const mapVehicleToApi = (vehicle) => ({
    vin: vehicle.vin || '',
    make: vehicle.make || '',
    model: vehicle.model || '',
    subModel: vehicle.subModel || vehicle.submodel || '',
    year: parseInt(vehicle.year) || 0,
    price: parseFloat(vehicle.price) || 0.0,
    mileage: parseInt(vehicle.mileage) || 0,
    color: vehicle.color || '',
    transmission: vehicle.transmission || '',
    image: vehicle.image || ''
  });

  // Map API response to frontend format
  const mapApiToVehicle = (apiVehicle) => ({
    id: apiVehicle.id,
    vin: apiVehicle.vin,
    make: apiVehicle.make,
    model: apiVehicle.model,
    submodel: apiVehicle.subModel, // Map subModel to submodel
    year: apiVehicle.year,
    price: apiVehicle.price,
    mileage: apiVehicle.mileage,
    color: apiVehicle.color,
    transmission: apiVehicle.transmission,
    image: apiVehicle.image
  });

  const fetchVehicles = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://carfinder.local/api/cars', {
        auth: {
          username: 'admin',
          password: 'admin123'
        },
        withCredentials: true
      });
      // Map each vehicle from API format to frontend format
      const mappedVehicles = response.data.map(mapApiToVehicle);
      setVehicles(mappedVehicles);
      setLoading(false);
    } catch (err) {
      setError('Could not load the list. Please try again.');
      setLoading(false);
      console.error('Vehicle fetch error:', err);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, []);


  const addVehicle = async (vehicleData) => {
    try {
      const response = await axios.post('http://carfinder.local/api/cars', mapVehicleToApi(vehicleData), {
        auth: {
          username: 'admin',
          password: 'admin123'
        },
        withCredentials: true
      });
      fetchVehicles();
      return response.data;
    } catch (err) {
      setError('Could not add vehicle.');
      console.error('Add vehicle error:', err);
    }
  };

  const updateVehicle = async (vehicleData) => {
    try {
      const response = await axios.put(`http://carfinder.local/api/cars/${vehicleData.id}`, mapVehicleToApi(vehicleData), {
        auth: {
          username: 'admin',
          password: 'admin123'
        },
        withCredentials: true
      });
      fetchVehicles();
      return response.data;
    } catch (err) {
      setError('Could not update vehicle.');
      console.error('Update vehicle error:', err);
    }
  };

  const deleteVehicle = async (vehicleId) => {
    try {
      // First call the backend API to delete from database
      await axios.delete(`http://carfinder.local/api/cars/${vehicleId}`, {
        auth: {
          username: 'admin',
          password: 'admin123'
        },
        withCredentials: true
      });
      
      // Only update local state after successful backend deletion
      setVehicles(prevVehicles => prevVehicles.filter(vehicle => vehicle.id !== vehicleId));
      
    } catch (err) {
      if (err.response?.status === 404) {
        // Vehicle doesn't exist in backend, remove ghost from UI
        setVehicles(prevVehicles => prevVehicles.filter(vehicle => vehicle.id !== vehicleId));
      } else {
        setError('Could not delete vehicle.');
        console.error('Delete vehicle error:', err);
      }
    }
  };

  return {
    vehicles,
    loading,
    error,
    addVehicle,
    updateVehicle,
    deleteVehicle
  };
};

// Custom hook for filtering and sorting vehicles
export const useVehicleFilters = (vehicles, searchQuery, activeFilters, sortOption) => {
  return useMemo(() => {
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
      result = result.filter(vehicle => {
        const priceInRange = vehicle.price >= activeFilters.priceRange[0] && 
                            vehicle.price <= activeFilters.priceRange[1];
        const yearInRange = vehicle.year >= activeFilters.years[0] && 
                           vehicle.year <= activeFilters.years[1];
        const makeMatch = activeFilters.makes.length === 0 || 
                         activeFilters.makes.includes(vehicle.make);
        const modelMatch = activeFilters.models.length === 0 || 
                          activeFilters.models.includes(vehicle.model);

        return priceInRange && yearInRange && makeMatch && modelMatch;
      });
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
  }, [vehicles, searchQuery, activeFilters, sortOption]);
};

// Custom hook for search functionality
export const useSearch = () => {
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const initialSearch = window.sessionStorage.getItem('carfinder-search');
    if (initialSearch) setSearchQuery(initialSearch);
  }, []);

  const clearSearch = () => {
    setSearchQuery('');
    window.sessionStorage.removeItem('carfinder-search');
  };

  return {
    searchQuery,
    setSearchQuery,
    clearSearch
  };
};
