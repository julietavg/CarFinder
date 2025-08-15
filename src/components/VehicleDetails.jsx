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

  const handleOverlayClick = (e) => {
    // Si el click es en el overlay (fondo) y no en el contenido del modal
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  const handleImageLoad = () => {
    // No necesitamos establecer imageLoaded ya que hemos eliminado esta funcionalidad
  };
  
  return (
    <div className={`vehicle-details-overlay ${showDetails ? 'show' : ''}`} onClick={handleOverlayClick}>
      <div className="vehicle-details-container">
        <button className="close-btn" onClick={handleClose}>×</button>
        
        {/* New Header Section */}
        <div className="modal-header" style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '20px 25px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          background: 'linear-gradient(135deg, rgba(40, 40, 60, 0.8), rgba(30, 30, 45, 0.8))',
          position: 'relative',
          zIndex: 10,
          width: '100%',
          boxSizing: 'border-box',
          margin: '0 0 0 0'
        }}>
          <div className="modal-header-left" style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <span className="modal-year" style={{
              fontSize: '1rem',
              fontWeight: '600',
              color: '#aaaaaa',
              background: 'rgba(60, 60, 80, 0.6)',
              padding: '6px 12px',
              borderRadius: '6px',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}>{vehicle.year}</span>
            <h2 className="modal-title" style={{
              fontSize: '1.5rem',
              fontWeight: '700',
              color: '#ffffff',
              margin: '0',
              textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)'
            }}>{vehicle.make} {vehicle.model}</h2>
          </div>
          
          <div className="modal-header-right">
            <span className="modal-price" style={{
              fontSize: '1.4rem',
              fontWeight: '800',
              color: '#ffffff',
              background: 'linear-gradient(90deg, #3a3a50, #5a5a75)',
              padding: '10px 18px',
              borderRadius: '8px',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)'
            }}>
              {vehicle.price ? new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
                maximumFractionDigits: 0
              }).format(vehicle.price) : 'Contact for Price'}
            </span>
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
                
                <div className="info-item">
                  <div className="info-content">
                    <span className="info-label">COLOR</span>
                    <span className="info-value">{vehicle.color || 'N/A'}</span>
                  </div>
                </div>
                
                <div className="info-item">
                  <div className="info-content">
                    <span className="info-label">TRANSMISSION</span>
                    <span className="info-value">{vehicle.transmission || 'N/A'}</span>
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
        </div>
      </div>
    </div>
  );
};

export default VehicleDetails;
