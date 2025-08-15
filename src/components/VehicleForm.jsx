import React, { useState, useEffect } from 'react';
import '../styles/components/VehicleForm.css';

const VehicleForm = ({ vehicle, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    make: '',
    model: '',
    year: new Date().getFullYear(),
    submodel: '',
    price: '',
    image: '',
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
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: name === 'price' ? value.replace(/[^\d]/g, '') : value,
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
    
    if (!formData.make.trim()) {
      errors.make = 'Make is required';
    }
    
    if (!formData.model.trim()) {
      errors.model = 'Model is required';
    }
    
    if (!formData.year || formData.year < 1900 || formData.year > new Date().getFullYear() + 1) {
      errors.year = `Year must be between 1900 and ${new Date().getFullYear() + 1}`;
    }
    
    if (!formData.price) {
      errors.price = 'Price is required';
    } else if (parseInt(formData.price) <= 0) {
      errors.price = 'Price must be greater than zero';
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
      price: parseInt(formData.price),
      year: parseInt(formData.year),
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
    <div className={`vehicle-form-overlay ${showForm ? 'show' : ''}`}>
      <div className="vehicle-form-container">
        <button className="close-form-btn" onClick={handleClose}>×</button>
        
        <div className="vehicle-form-header">
          <h2>{isEditing ? 'Edit Vehicle' : 'Add New Vehicle'}</h2>
          <p className="form-subtitle">Enter the details of the vehicle</p>
        </div>
        
        <form onSubmit={handleSubmit} className="vehicle-form">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="make">
                Make <span className="required">*</span>
              </label>
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
              <label htmlFor="model">
                Model <span className="required">*</span>
              </label>
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
              <label htmlFor="year">
                Year <span className="required">*</span>
              </label>
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
          
          <div className="form-group">
            <label htmlFor="price">
              Price <span className="required">*</span>
            </label>
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
