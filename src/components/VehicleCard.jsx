import React, { memo } from 'react';
import PropTypes from 'prop-types';
import formatPrice from '../utils/formatPrice';

const VehicleCard = memo(function VehicleCard({ vehicle, index, onView, onEdit, onDelete, onImageError }) {
  return (
    <div
      className="vehicle-card"
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <div className="vehicle-image-container">
        <img
          src={vehicle.image}
          alt={`${vehicle.make} ${vehicle.model} (${vehicle.year})`}
          className="vehicle-image"
          onError={() => onImageError(vehicle.id)}
        />
        <div className="vehicle-overlay">
          <button
            className="action-btn view-btn"
            onClick={() => onView(vehicle)}
            style={{ animationDelay: `${0.2 + index * 0.15}s` }}
            aria-label={`View details of ${vehicle.make} ${vehicle.model}`}
          >
            View Details
          </button>
          <button
            className="action-btn edit-btn"
            onClick={() => onEdit(vehicle)}
            style={{ animationDelay: `${0.5 + index * 0.15}s` }}
            aria-label={`Edit ${vehicle.make} ${vehicle.model}`}
          >
            Edit
          </button>
          <button
            className="action-btn delete-btn"
            onClick={() => onDelete(vehicle.id)}
            style={{ animationDelay: `${0.8 + index * 0.15}s` }}
            aria-label={`Delete ${vehicle.make} ${vehicle.model}`}
          >
            Delete
          </button>
        </div>
      </div>
      <div className="vehicle-info">
        <h3 className="vehicle-title">{vehicle.make} {vehicle.model}</h3>
        <p className="vehicle-subtitle">{vehicle.year} • {vehicle.submodel}</p>
        <p className="vehicle-price">{formatPrice(vehicle.price)}</p>
      </div>
    </div>
  );
});

VehicleCard.propTypes = {
  vehicle: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
    make: PropTypes.string.isRequired,
    model: PropTypes.string.isRequired,
    year: PropTypes.number.isRequired,
    submodel: PropTypes.string,
    price: PropTypes.number.isRequired,
    image: PropTypes.string.isRequired
  }).isRequired,
  index: PropTypes.number.isRequired,
  onView: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onImageError: PropTypes.func.isRequired
};

export default VehicleCard;
