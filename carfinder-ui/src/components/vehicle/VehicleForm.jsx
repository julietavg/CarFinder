import React, { useState, useEffect } from 'react';
import '../../styles/components/VehicleForm.css';

const VehicleForm = ({ vehicle, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    make: '',
    model: '',
    year: new Date().getFullYear(),
    submodel: '',
    price: '',
    image: '',
  transmission: 'Automatic',
    mileage: '',
    color: '',
    vin: '',
  });
  
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const [formSubmitted, setFormSubmitted] = useState(false);
  
  // Inicializar el formulario con datos si estamos editando
  useEffect(() => {
    if (vehicle) {
      setFormData({
        make: vehicle.make || '',
        model: vehicle.model || '',
        year: vehicle.year || new Date().getFullYear(),
        submodel: vehicle.submodel || '',
        price: vehicle.price || '',
        image: vehicle.image || '',
        transmission: vehicle.transmission === 'Manual' || vehicle.transmission === 'Automatic'
          ? vehicle.transmission
          : 'Automatic',
        mileage: vehicle.mileage || '',
        color: vehicle.color || '',
        vin: vehicle.vin || '',
      });
      setIsEditing(true);
    }
    
    // Pequeño retardo para la animación
    setTimeout(() => {
      setShowForm(true);
    }, 50);
  }, [vehicle]);
  
  const handleClose = () => {
    setShowForm(false);
    setTimeout(() => {
      onClose();
    }, 400);
  };

  const handleOverlayClick = (e) => {
    // Si el click es en el overlay (fondo) y no en el contenido del modal
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: (name === 'price' || name === 'mileage') ? value.replace(/[^\d]/g, '') : value,
    }));
    
    // Limpiar errores de validación cuando el usuario escribe
    if (validationErrors[name]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: '',
      }));
    }
  };
  
  const validateForm = () => {
    const errors = {};
    // VIN: obligatorio, exactamente 17 caracteres, sin I, O, Q
    if (!formData.vin) {
      errors.vin = 'VIN is required';
    } else if (formData.vin.length !== 17) {
      errors.vin = 'VIN must be exactly 17 characters';
    } else if (/[IOQ]/i.test(formData.vin)) {
      errors.vin = 'VIN cannot contain I, O, or Q';
    }

    // Make: obligatorio
    if (!formData.make) {
      errors.make = 'Make is required';
    }
    // Model: obligatorio
    if (!formData.model) {
      errors.model = 'Model is required';
    }
    // Submodel: obligatorio
    if (!formData.submodel) {
      errors.submodel = 'Submodel is required';
    }
    // Year: obligatorio, entre 2025 y año siguiente
    const minYear = 1900;
    const maxYear = 2026;
    if (!formData.year) {
      errors.year = 'Year is required';
    } else if (formData.year < minYear || formData.year > maxYear) {
      errors.year = `Year must be between ${minYear} and ${maxYear}`;
    }
    // Mileage: obligatorio, mayor o igual a 0
    if (formData.mileage === '' || formData.mileage === null || formData.mileage === undefined) {
      errors.mileage = 'Mileage is required';
    } else if (parseInt(formData.mileage) < 0) {
      errors.mileage = 'Mileage must be 0 or greater';
    }
    // Color: obligatorio
    if (!formData.color) {
      errors.color = 'Color is required';
    }
    // Transmission: obligatorio, debe ser Automatic o Manual
    if (!formData.transmission) {
      errors.transmission = 'Transmission is required';
    } else if (!['Automatic', 'Manual'].includes(formData.transmission)) {
      errors.transmission = 'Transmission must be Automatic or Manual';
    }
    // Price: obligatorio, entre 5000 y 350000
    const minPrice = 5000;
    const maxPrice = 350000;
    if (!formData.price) {
      errors.price = 'Price is required';
    } else if (parseInt(formData.price) < minPrice) {
      errors.price = `Price must be at least ${minPrice}`;
    } else if (parseInt(formData.price) > maxPrice) {
      errors.price = `Price must not exceed ${maxPrice}`;
    }
    // Image: obligatorio, debe ser URL http(s)
    if (!formData.image) {
      errors.image = 'Image URL is required';
    } else if (!/^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)$/i.test(formData.image)) {
      errors.image = 'Image must be a valid URL (jpg, jpeg, png, gif, webp)';
    }
    return errors;
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    const errors = validateForm();
    
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }
    
    // Prepare data for submission
    const vehicleData = {
      ...formData,
      price: formData.price ? parseInt(formData.price) : 0,
      year: formData.year ? parseInt(formData.year) : new Date().getFullYear(),
      mileage: formData.mileage ? parseInt(formData.mileage) : null,
      id: isEditing && vehicle ? vehicle.id : Date.now(), // Use existing ID when editing
    };
    
    setFormSubmitted(true);
    
    // Simulate API call with success
    setTimeout(() => {
      onSave(vehicleData);
      handleClose();
    }, 800);
  };
  
  return (
    <div className={`vehicle-form-overlay ${showForm ? 'show' : ''}`} onClick={handleOverlayClick}>
      <div className="vehicle-form-container">
        <button className="close-form-btn" onClick={handleClose}>×</button>
        
        <div className="vehicle-form-header">
          <h2>{isEditing ? 'Edit Vehicle' : 'Add New Vehicle'}</h2>
          <p className="form-subtitle">Enter the details of the vehicle</p>
        </div>
        
        <form onSubmit={handleSubmit} className="vehicle-form">
          <div className="form-group">
            <label htmlFor="vin">VIN</label>
            <input
              type="text"
              id="vin"
              name="vin"
              placeholder="e.g. 1HGBH41JXMN109186"
              value={formData.vin}
              onChange={handleChange}
              disabled={formSubmitted}
              readOnly={isEditing}
            />
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="make">Make</label>
              <input
                type="text"
                id="make"
                name="make"
                placeholder="e.g. Ford"
                value={formData.make}
                onChange={handleChange}
                className={validationErrors.make ? 'error' : ''}
                disabled={formSubmitted}
              />
              {validationErrors.make && (
                <span className="error-message">{validationErrors.make}</span>
              )}
            </div>
            
            <div className="form-group">
              <label htmlFor="model">Model</label>
              <input
                type="text"
                id="model"
                name="model"
                placeholder="e.g. Mustang"
                value={formData.model}
                onChange={handleChange}
                className={validationErrors.model ? 'error' : ''}
                disabled={formSubmitted}
              />
              {validationErrors.model && (
                <span className="error-message">{validationErrors.model}</span>
              )}
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="year">Year</label>
              <input
                type="number"
                id="year"
                name="year"
                placeholder="e.g. 2022"
                value={formData.year}
                onChange={handleChange}
                min="1900"
                max={new Date().getFullYear() + 1}
                className={validationErrors.year ? 'error' : ''}
                disabled={formSubmitted}
              />
              {validationErrors.year && (
                <span className="error-message">{validationErrors.year}</span>
              )}
            </div>
            
            <div className="form-group">
              <label htmlFor="submodel">Submodel</label>
              <input
                type="text"
                id="submodel"
                name="submodel"
                placeholder="e.g. GT"
                value={formData.submodel}
                onChange={handleChange}
                disabled={formSubmitted}
              />
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="transmission">Transmission</label>
              <select
                id="transmission"
                name="transmission"
                value={formData.transmission}
                onChange={handleChange}
                disabled={formSubmitted}
              >
                <option value="Automatic">Automatic</option>
                <option value="Manual">Manual</option>
              </select>
            </div>
            
            <div className="form-group">
              <label htmlFor="mileage">Mileage</label>
              <input
                type="text"
                id="mileage"
                name="mileage"
                placeholder="e.g. 25000"
                value={formData.mileage}
                onChange={handleChange}
                disabled={formSubmitted}
              />
              <small className="field-hint">Enter mileage in miles</small>
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="color">Color</label>
              <input
                type="text"
                id="color"
                name="color"
                placeholder="e.g. Red, Blue, Black"
                value={formData.color}
                onChange={handleChange}
                disabled={formSubmitted}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="price">Price</label>
              <div className="price-input-container">
                <span className="price-symbol">$</span>
                <input
                  type="text"
                  id="price"
                  name="price"
                  placeholder="e.g. 35000"
                  value={formData.price}
                  onChange={handleChange}
                  className={`price-input ${validationErrors.price ? 'error' : ''}`}
                  disabled={formSubmitted}
                />
              </div>
              {validationErrors.price && (
                <span className="error-message">{validationErrors.price}</span>
              )}
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="image">Image URL</label>
            <input
              type="text"
              id="image"
              name="image"
              placeholder="https://example.com/car-image.jpg"
              value={formData.image}
              onChange={handleChange}
              disabled={formSubmitted}
            />
          </div>
          
          {formData.image && (
            <div className="image-preview-container">
              <p>Image Preview:</p>
              <div className="image-preview">
                <img 
                  src={formData.image} 
                  alt="Vehicle preview" 
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = `https://via.placeholder.com/400x200/1a1a1a/ffffff?text=Image+Not+Found`;
                  }}
                />
              </div>
            </div>
          )}
          
          <div className="form-actions">
            <button 
              type="button" 
              className="cancel-btn" 
              onClick={handleClose}
              disabled={formSubmitted}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className={`save-btn ${formSubmitted ? 'submitting' : ''}`}
              disabled={formSubmitted}
            >
              {formSubmitted ? (
                <>
                  <span className="button-loader"></span>
                  <span>Saving...</span>
                </>
              ) : (
                isEditing ? 'Update Vehicle' : 'Add Vehicle'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VehicleForm;
