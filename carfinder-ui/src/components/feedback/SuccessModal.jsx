import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import '../../styles/components/SuccessModal.css';

const SuccessModal = ({ open, message, onClose, autoCloseMs = 2400 }) => {
  useEffect(() => {
    if (!open) return;
    const t = setTimeout(() => onClose?.(), autoCloseMs);
    return () => clearTimeout(t);
  }, [open, autoCloseMs, onClose]);

  if (!open) return null;

  return (
    <div className="success-overlay" role="status" aria-live="polite" onClick={onClose}>
      <div className="success-box" onClick={(e) => e.stopPropagation()}>
        <div className="success-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M20 6L9 17l-5-5" />
          </svg>
        </div>
        <div className="success-text">{message}</div>
        <button className="success-close" onClick={onClose} aria-label="Close">×</button>
      </div>
    </div>
  );
};

SuccessModal.propTypes = {
  open: PropTypes.bool,
  message: PropTypes.string,
  onClose: PropTypes.func,
  autoCloseMs: PropTypes.number,
};

export default SuccessModal;
