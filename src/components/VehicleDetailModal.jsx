import React, { useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';
import './VehicleDetailModal.css';

const VehicleDetailModal = ({ vehicle, onClose, onBackToHome }) => {
  const { isDarkMode } = useContext(ThemeContext);
  
  if (!vehicle) return null;
  
  return (
    <div className={`vehicle-detail-modal ${isDarkMode ? 'dark' : 'light'}`}>
      <div className="modal-overlay" onClick={onClose}></div>
      <div className="modal-content">
        <button className="modal-close-btn" onClick={onClose}>×</button>
        
        <div className="modal-header">
          <h2>{vehicle.make} {vehicle.model} {vehicle.year}</h2>
          <p className="vehicle-submodel-detail">{vehicle.submodel}</p>
        </div>
        
        <div className="modal-body">
          <div className="vehicle-image-detail">
            <img src={vehicle.image} alt={`${vehicle.make} ${vehicle.model}`} />
          </div>
          
          <div className="vehicle-info-detail">
            <div className="info-grid">
              <div className="info-item">
                <span className="info-label">VIN</span>
                <span className="info-value">{vehicle.vin}</span>
              </div>
              
              <div className="info-item">
                <span className="info-label">Year</span>
                <span className="info-value">{vehicle.year}</span>
              </div>
              
              <div className="info-item">
                <span className="info-label">Make</span>
                <span className="info-value">{vehicle.make}</span>
              </div>
              
              <div className="info-item">
                <span className="info-label">Model</span>
                <span className="info-value">{vehicle.model}</span>
              </div>
              
              <div className="info-item">
                <span className="info-label">Submodel</span>
                <span className="info-value">{vehicle.submodel}</span>
              </div>
              
              <div className="info-item">
                <span className="info-label">Condition</span>
                <span className="info-value">{vehicle.used ? 'Used' : 'New'}</span>
              </div>
              
              <div className="info-item">
                <span className="info-label">Mileage</span>
                <span className="info-value">{vehicle.mileage.toLocaleString()} miles</span>
              </div>
              
              <div className="info-item">
                <span className="info-label">Price</span>
                <span className="info-value price-value">${vehicle.price.toLocaleString()}</span>
              </div>
              
              <div className="info-item">
                <span className="info-label">Color</span>
                <span className="info-value">{vehicle.color}</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="modal-footer">
          <button className="modal-btn close-btn" onClick={onClose}>Close</button>
          <button className="modal-btn back-btn" onClick={onBackToHome}>Back to Home</button>
        </div>
      </div>
    </div>
  );
};

export default VehicleDetailModal;
