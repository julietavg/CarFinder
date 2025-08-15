import React, { useState, useEffect, useRef } from 'react';
import '../styles/components/VehicleDetailsModal.css';

const VehicleDetailsModal = ({ vehicle, isOpen, onClose }) => {
  const [mainImage, setMainImage] = useState('');
  const modalRef = useRef(null);

  useEffect(() => {
    if (vehicle && vehicle.images && vehicle.images.length > 0) {
      setMainImage(vehicle.images[0]);
    } else if (vehicle && vehicle.image) {
      setMainImage(vehicle.image);
    }
  }, [vehicle]);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target) && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!vehicle) return null;

  // Debug logging
  console.log('VehicleDetailsModal rendering:', { 
    vehicle, 
    isOpen,
    vehicleYear: vehicle.year,
    vehicleMake: vehicle.make,
    vehicleModel: vehicle.model,
    vehiclePrice: vehicle.price 
  });

  // Format currency
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(price);
  };

  // Format mileage
  const formatMileage = (mileage) => {
    return mileage.toLocaleString();
  };

  // Format descriptions for readability
  const formatDescription = (desc) => {
    if (!desc) return "No description available for this vehicle.";
    return desc;
  };

  // Handle image errors
  const handleImageError = (e) => {
    e.target.onerror = null;
    e.target.src = 'https://via.placeholder.com/800x600?text=No+Image+Available';
  };

  // Generate thumbnail images
  const renderThumbnails = () => {
    if (!vehicle.images || vehicle.images.length === 0) {
      // If no images array, use the single image
      return (
        <>
          <div className="gallery-thumb">
            <img 
              src={vehicle.image || 'https://via.placeholder.com/300x200?text=No+Image'} 
              alt={`${vehicle.year} ${vehicle.make} ${vehicle.model} thumbnail`}
              onError={handleImageError}
              onClick={() => setMainImage(vehicle.image)}
            />
          </div>
          <div className="gallery-thumb">
            <img 
              src="https://via.placeholder.com/300x200?text=No+Image" 
              alt="No additional photos"
              onError={handleImageError}
            />
          </div>
          <div className="gallery-thumb">
            <img 
              src="https://via.placeholder.com/300x200?text=No+Image" 
              alt="No additional photos"
              onError={handleImageError}
            />
          </div>
          <div className="gallery-thumb">
            <img 
              src="https://via.placeholder.com/300x200?text=No+Image" 
              alt="No additional photos"
              onError={handleImageError}
            />
          </div>
        </>
      );
    }

    // If we have an images array
    return vehicle.images.slice(0, 3).map((img, index) => (
      <div className="gallery-thumb" key={index}>
        <img 
          src={img} 
          alt={`${vehicle.year} ${vehicle.make} ${vehicle.model} thumbnail ${index + 1}`}
          onError={handleImageError}
          onClick={() => setMainImage(img)}
        />
      </div>
    )).concat(
      vehicle.images.length > 3 ? (
        <div className="gallery-thumb more-photos" key="more">
          <img 
            src={vehicle.images[3]} 
            alt={`${vehicle.year} ${vehicle.make} ${vehicle.model} more photos`}
            onError={handleImageError}
          />
        </div>
      ) : (
        <div className="gallery-thumb" key="placeholder">
          <img 
            src="https://via.placeholder.com/300x200?text=No+Image" 
            alt="No additional photos"
            onError={handleImageError}
          />
        </div>
      )
    );
  };

  console.log('About to render modal JSX with vehicle:', vehicle);

  return (
    <div className={`vehicle-details-modal ${isOpen ? 'open' : ''}`}>
      {/* DEBUG - Should always be visible when modal is rendered */}
      <div style={{
        position: 'fixed',
        top: '10px',
        right: '10px',
        background: 'red',
        color: 'white',
        padding: '10px',
        zIndex: 9999,
        fontSize: '12px'
      }}>
        MODAL RENDERED - isOpen: {isOpen ? 'TRUE' : 'FALSE'}
      </div>
      
      <div className="vehicle-details-container" ref={modalRef}>
        <button className="close-details-btn" onClick={onClose} aria-label="Close details">
          ×
        </button>
        
        {/* New Header Section */}
        <div className="modal-header" style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '20px 25px',
          borderBottom: '2px solid #e5e7eb',
          background: '#ffffff',
          position: 'relative',
          zIndex: 10,
          width: '100%',
          boxSizing: 'border-box'
        }}>
          <div className="modal-header-left" style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            <span className="modal-year" style={{
              fontSize: '1.1rem',
              fontWeight: '600',
              color: '#666666',
              background: '#f5f5f5',
              padding: '4px 8px',
              borderRadius: '4px'
            }}>{vehicle.year}</span>
            <h2 className="modal-title" style={{
              fontSize: '1.4rem',
              fontWeight: '700',
              color: '#333333',
              margin: '0'
            }}>{vehicle.make} {vehicle.model}</h2>
          </div>
          <div className="modal-header-right" style={{
            display: 'flex',
            alignItems: 'center'
          }}>
            <span className="modal-price" style={{
              fontSize: '1.5rem',
              fontWeight: '700',
              color: '#2563eb'
            }}>{formatPrice(vehicle.price)}</span>
          </div>
        </div>
        
        <div className="vehicle-details-content">
          <div className="vehicle-gallery">
            <div className="gallery-main">
              <img 
                src={mainImage || vehicle.image || 'https://via.placeholder.com/800x600?text=No+Image+Available'} 
                alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
                onError={handleImageError}
              />
            </div>
            <div className="gallery-thumbs">
              {renderThumbnails()}
            </div>
          </div>
          
          <div className="vehicle-info-grid">
            <div className="vehicle-main-info">
              <div className="vehicle-specs">
                <div className="vehicle-spec-item">
                  <div className="spec-value">{vehicle.year}</div>
                  <div className="spec-label">Year</div>
                </div>
                <div className="vehicle-spec-item">
                  <div className="spec-value">{formatMileage(vehicle.mileage)}</div>
                  <div className="spec-label">Miles</div>
                </div>
                <div className="vehicle-spec-item">
                  <div className="spec-value">{vehicle.transmission || 'N/A'}</div>
                  <div className="spec-label">Transmission</div>
                </div>
                <div className="vehicle-spec-item">
                  <div className="spec-value">{vehicle.fuelType || 'N/A'}</div>
                  <div className="spec-label">Fuel Type</div>
                </div>
                <div className="vehicle-spec-item">
                  <div className="spec-value">{vehicle.exteriorColor || 'N/A'}</div>
                  <div className="spec-label">Ext. Color</div>
                </div>
                <div className="vehicle-spec-item">
                  <div className="spec-value">{vehicle.interiorColor || 'N/A'}</div>
                  <div className="spec-label">Int. Color</div>
                </div>
              </div>
              
              <div className="vehicle-description">
                <h3>Vehicle Description</h3>
                <p>{formatDescription(vehicle.description)}</p>
              </div>
              
              <div className="vehicle-features-list">
                <h3>Features & Options</h3>
                <div className="features-grid">
                  {vehicle.features && vehicle.features.length > 0 ? (
                    vehicle.features.map((feature, index) => (
                      <div className="feature-item" key={index}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                          <path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.267.267 0 0 1 .02-.022z"/>
                        </svg>
                        <span>{feature}</span>
                      </div>
                    ))
                  ) : (
                    <p>No features listed for this vehicle.</p>
                  )}
                </div>
              </div>
              
              <div className="vehicle-actions">
                <button className="action-btn">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/>
                  </svg>
                  Save
                </button>
                <button className="action-btn">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M8.051 1.999h.089c.822.003 4.987.033 6.11.335a2.01 2.01 0 0 1 1.415 1.42c.101.38.172.883.22 1.402l.01.104.022.26.008.104c.065.914.073 1.77.074 1.957v.075c-.001.194-.01 1.108-.082 2.06l-.008.105-.009.104c-.05.572-.124 1.14-.235 1.558a2.007 2.007 0 0 1-1.415 1.42c-1.16.312-5.569.334-6.18.335h-.142c-.309 0-1.587-.006-2.927-.052l-.17-.006-.087-.004-.171-.007-.171-.007c-1.11-.049-2.167-.128-2.654-.26a2.007 2.007 0 0 1-1.415-1.419c-.111-.417-.185-.986-.235-1.558L.09 9.82l-.008-.104A31.4 31.4 0 0 1 0 7.68v-.123c.002-.215.01-.958.064-1.778l.007-.103.003-.052.008-.104.022-.26.01-.104c.048-.519.119-1.023.22-1.402a2.007 2.007 0 0 1 1.415-1.42c.487-.13 1.544-.21 2.654-.26l.17-.007.172-.006.086-.003.171-.007A99.788 99.788 0 0 1 7.858 2h.193zM6.4 5.209v4.818l4.157-2.408L6.4 5.209z"/>
                  </svg>
                  Watch Video
                </button>
                <button className="action-btn">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M8 12.963a7 7 0 0 1-7-7V4.5h1v1.5a6 6 0 0 0 12 0V4.5h1V6a7 7 0 0 1-7 6.963zm1-11a1 1 0 1 0-2 0 1 1 0 0 0 2 0z"/>
                    <path d="M12 1a1 1 0 0 0-1 1v4.887a4.988 4.988 0 0 1-5 0V2a1 1 0 0 0-2 0v4.887a7.001 7.001 0 0 0 14 0V2a1 1 0 0 0-1-1z"/>
                  </svg>
                  Share
                </button>
                <button className="action-btn">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M6 13c0 1.105-1.12 2-2.5 2S1 14.105 1 13c0-1.104 1.12-2 2.5-2s2.5.896 2.5 2zm9-2c0 1.105-1.12 2-2.5 2s-2.5-.895-2.5-2 1.12-2 2.5-2 2.5.895 2.5 2z"/>
                    <path fillRule="evenodd" d="M14 11V2h1v9h-1zM6 3v10H5V3h1z"/>
                    <path d="M5 2.905a1 1 0 0 1 .9-.995l8-.8a1 1 0 0 1 1.1.995V3L5 4V2.905z"/>
                  </svg>
                  Compare
                </button>
                <button className="action-btn">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M8 1a2.5 2.5 0 0 1 2.5 2.5V4h-5v-.5A2.5 2.5 0 0 1 8 1zm3.5 3v-.5a3.5 3.5 0 1 0-7 0V4H1v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V4h-3.5zM2 5h12v9a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V5z"/>
                  </svg>
                  Test Drive
                </button>
              </div>
            </div>
            
            <div className="vehicle-side-details">
              <div className="contact-dealer">
                <h3>Contact Seller</h3>
                <div className="dealer-info">
                  <div className="dealer-name">Premium Auto Dealership</div>
                  <div className="dealer-location">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16">
                      <path d="M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10zm0-7a3 3 0 1 1 0-6 3 3 0 0 1 0 6z"/>
                    </svg>
                    <span>123 Auto Lane, Car City, ST 12345</span>
                  </div>
                </div>
                
                <div className="contact-actions">
                  <button className="contact-btn primary-btn">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                      <path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V4Zm2-1a1 1 0 0 0-1 1v.217l7 4.2 7-4.2V4a1 1 0 0 0-1-1H2Zm13 2.383-4.708 2.825L15 11.105V5.383Zm-.034 6.876-5.64-3.471L8 9.583l-1.326-.795-5.64 3.47A1 1 0 0 0 2 13h12a1 1 0 0 0 .966-.741ZM1 11.105l4.708-2.897L1 5.383v5.722Z"/>
                    </svg>
                    Email Dealer
                  </button>
                  <button className="contact-btn secondary-btn">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                      <path fillRule="evenodd" d="M1.885.511a1.745 1.745 0 0 1 2.61.163L6.29 2.98c.329.423.445.974.315 1.494l-.547 2.19a.678.678 0 0 0 .178.643l2.457 2.457a.678.678 0 0 0 .644.178l2.189-.547a1.745 1.745 0 0 1 1.494.315l2.306 1.794c.829.645.905 1.87.163 2.611l-1.034 1.034c-.74.74-1.846 1.065-2.877.702a18.634 18.634 0 0 1-7.01-4.42 18.634 18.634 0 0 1-4.42-7.009c-.362-1.03-.037-2.137.703-2.877L1.885.511z"/>
                    </svg>
                    Call Dealer
                  </button>
                </div>
              </div>
              
              <div className="vehicle-location">
                <h3>Vehicle Location</h3>
                <div className="map-placeholder">
                  <span>Map View</span>
                </div>
              </div>
              
              <div className="additional-info">
                <div className="info-item">
                  <span>Stock #:</span>
                  <span>{vehicle.stockNumber || 'N/A'}</span>
                </div>
                <div className="info-item">
                  <span>VIN:</span>
                  <span>{vehicle.vin || 'N/A'}</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="similar-vehicles">
            <h3>Similar Vehicles</h3>
            <div className="similar-vehicles-list">
              {[1, 2, 3, 4, 5].map((i) => (
                <div className="similar-vehicle-card" key={i}>
                  <div className="similar-vehicle-img">
                    <img 
                      src={`https://via.placeholder.com/200x120?text=Similar+${i}`} 
                      alt={`Similar Vehicle ${i}`} 
                    />
                  </div>
                  <div className="similar-vehicle-info">
                    <div className="similar-vehicle-title">
                      {vehicle.year} {vehicle.make} Similar
                    </div>
                    <div className="similar-vehicle-price">
                      {formatPrice(vehicle.price - 1000 * i)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VehicleDetailsModal;
