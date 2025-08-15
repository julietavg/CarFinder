import React, { useState, useEffect } from 'react';
import '../styles/components/ConfirmationModal.css';

const ConfirmationModal = ({ 
  show, 
  onClose, 
  onConfirm, 
  title = "Confirm Action", 
  message = "Are you sure you want to proceed?",
  confirmText = "Confirm",
  cancelText = "Cancel",
  type = "danger" // danger, warning, info
}) => {
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (show) {
      setTimeout(() => {
        setShowModal(true);
      }, 50);
    } else {
      setShowModal(false);
    }
  }, [show]);

  const handleClose = () => {
    setShowModal(false);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  const handleConfirm = () => {
    setShowModal(false);
    setTimeout(() => {
      onConfirm();
      onClose();
    }, 300);
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  if (!show) return null;

  return (
    <div className={`confirmation-overlay ${showModal ? 'show' : ''}`} onClick={handleOverlayClick}>
      <div className="confirmation-modal">
        <div className="confirmation-header">
          <div className={`confirmation-icon ${type}`}>
            {type === 'danger' && (
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="15" y1="9" x2="9" y2="15"></line>
                <line x1="9" y1="9" x2="15" y2="15"></line>
              </svg>
            )}
            {type === 'warning' && (
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/>
                <line x1="12" y1="9" x2="12" y2="13"/>
                <line x1="12" y1="17" x2="12.01" y2="17"/>
              </svg>
            )}
          </div>
          <h3>{title}</h3>
        </div>
        
        <div className="confirmation-content">
          <p>{message}</p>
        </div>
        
        <div className="confirmation-actions">
          <button 
            className="confirmation-btn cancel-btn" 
            onClick={handleClose}
          >
            {cancelText}
          </button>
          <button 
            className={`confirmation-btn confirm-btn ${type}`} 
            onClick={handleConfirm}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
