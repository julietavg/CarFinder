import React, { useState, useEffect } from 'react';
import '../styles/components/VehicleDetails.css';

const VehicleDetails = ({ vehicle, onClose }) => {
  const [showDetails, setShowDetails] = useState(false);
  
  useEffect(() => {
    // Añadir un pequeño retardo para permitir la animación de entrada
    setTimeout(() => {
      setShowDetails(true);
    }, 50);
    
    // Bloquear el desplazamiento del cuerpo cuando se muestran los detalles
    document.body.style.overflow = 'hidden';
    
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);
  
  const handleClose = () => {
    setShowDetails(false);
    setTimeout(() => {
      onClose();
    }, 400); // Esperar a que termine la animación de salida
  };
  
  const handleImageLoad = () => {
    // No necesitamos establecer imageLoaded ya que hemos eliminado esta funcionalidad
  };
  
  return (
    <div className={`vehicle-details-overlay ${showDetails ? 'show' : ''}`}>
      <div className="vehicle-details-container">
        <button className="close-btn" onClick={handleClose}>×</button>
        
        <div className="vehicle-details-header">
          <div className="detail-title-badge">
            <span className="detail-year">{vehicle.year}</span>
            <h1>{vehicle.make} {vehicle.model}</h1>
          </div>
          <h2 className="detail-submodel">{vehicle.submodel}</h2>
          <div className="detail-price-badge">
            <span className="price-symbol">$</span>
            <span className="price-amount">{vehicle.price?.toLocaleString()}</span>
            <span className="price-decimals">.00</span>
          </div>
        </div>
        
        <div className="vehicle-details-main">
          <div className="vehicle-image-wrapper">
            <div className="vehicle-image-container">
              <img 
                src={vehicle.image || `https://via.placeholder.com/800x500/1a1a1a/ffffff?text=${vehicle.make}+${vehicle.model}`}
                alt={`${vehicle.make} ${vehicle.model}`}
                className="vehicle-detail-image"
                onLoad={handleImageLoad}
              />
              <div className="image-hover-effect"></div>
            </div>
            
            <div className="image-caption">
              <div className="caption-badge">
                {vehicle.color || 'N/A'} | {vehicle.used ? 'Used Vehicle' : 'New Vehicle'}
              </div>
            </div>
          </div>
          
          <div className="vehicle-details-info">
            <div className="info-section">
              <h3 className="info-section-title">Vehicle Information</h3>
              <div className="info-grid">
                <div className="info-item">
                  <div className="info-content">
                    <span className="info-label">VIN</span>
                    <span className="info-value">{vehicle.vin || 'N/A'}</span>
                  </div>
                </div>
                
                <div className="info-item">
                  <div className="info-content">
                    <span className="info-label">MILEAGE</span>
                    <span className="info-value">{vehicle.mileage ? vehicle.mileage.toLocaleString() + ' miles' : 'N/A'}</span>
                  </div>
                </div>
                
                <div className="info-item">
                  <div className="info-content">
                    <span className="info-label">MAKE</span>
                    <span className="info-value">{vehicle.make}</span>
                  </div>
                </div>
                
                <div className="info-item">
                  <div className="info-content">
                    <span className="info-label">MODEL</span>
                    <span className="info-value">{vehicle.model}</span>
                  </div>
                </div>
                
                <div className="info-item">
                  <div className="info-content">
                    <span className="info-label">SUBMODEL</span>
                    <span className="info-value">{vehicle.submodel}</span>
                  </div>
                </div>
                
                <div className="info-item">
                  <div className="info-content">
                    <span className="info-label">YEAR</span>
                    <span className="info-value">{vehicle.year}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="vehicle-details-actions">
          <button className="action-btn close-btn-styled" onClick={handleClose}>
            Close
          </button>
          <button className="action-btn home-btn" onClick={handleClose}>
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default VehicleDetails;
