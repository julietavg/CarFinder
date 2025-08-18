import React, { useEffect, useState } from 'react';
import '../../styles/components/VehicleForm.css';

const VIN_FORBIDDEN = /[IOQioq]/g;
const YEAR_MIN = 1930;
const YEAR_MAX = 2026;
const PRICE_MIN = 5000;
const PRICE_MAX = 350000;

const VehicleForm = ({ vehicle, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    id: null,
    vin: '',
    year: new Date().getFullYear(),
    make: '',
    model: '',
    submodel: '',
    transmission: 'Automatic',
    mileage: '',
    color: '',
    price: '',
    image: ''
  });

  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [serverMessage, setServerMessage] = useState(null); // mensajes como 409 (VIN duplicado)

  // Inicializar datos cuando abrimos el formulario
  useEffect(() => {
    if (vehicle) {
      setFormData({
        id: vehicle.id ?? null,
        vin: vehicle.vin || '',
        year: vehicle.year ?? new Date().getFullYear(),
        make: vehicle.make || '',
        model: vehicle.model || '',
        submodel: vehicle.submodel || '',
        transmission:
          vehicle.transmission === 'Manual' || vehicle.transmission === 'Automatic'
            ? vehicle.transmission
            : 'Automatic',
        mileage: vehicle.mileage ?? '',
        color: vehicle.color || '',
        price: vehicle.price ?? '',
        image: vehicle.image || ''
      });
      setIsEditing(true);
    } else {
      setIsEditing(false);
    }
    const t = setTimeout(() => setShowForm(true), 50);
    return () => clearTimeout(t);
  }, [vehicle]);

  const handleClose = () => {
    setShowForm(false);
    setTimeout(() => onClose && onClose(), 400);
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) handleClose();
  };

  // Sanitizadores
  const sanitizePrice = (val) => {
    const cleaned = val.replace(/[^0-9.]/g, '');
    const parts = cleaned.split('.');
    if (parts.length <= 1) return cleaned;
    return parts[0] + '.' + parts.slice(1).join('').replace(/\./g, '');
  };
  const sanitizeMileage = (val) => val.replace(/[^\d]/g, '');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setServerMessage(null);

    let next = value;

    if (name === 'vin') {
      // VIN siempre mayúsculas y sin I/O/Q
      next = value.toUpperCase().replace(VIN_FORBIDDEN, '');
    } else if (name === 'price') {
      next = sanitizePrice(value);
    } else if (name === 'mileage') {
      next = sanitizeMileage(value);
    }

    setFormData((prev) => ({ ...prev, [name]: next }));

    if (validationErrors[name]) {
      setValidationErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  // Validación en cliente
  const validate = () => {
    const err = {};
    const requiredText = (v) => String(v ?? '').trim().length > 0;

    if (!requiredText(formData.vin)) err.vin = 'VIN cannot be empty.';
    if (!requiredText(formData.make)) err.make = 'Make cannot be empty.';
    if (!requiredText(formData.model)) err.model = 'Model cannot be empty.';
    if (!requiredText(formData.submodel)) err.submodel = 'Submodel cannot be empty.';
    if (!requiredText(formData.transmission)) err.transmission = 'Transmission cannot be empty.';
    if (!requiredText(formData.color)) err.color = 'Color cannot be empty.';
    if (!requiredText(formData.image)) err.image = 'Image cannot be empty.';

    const y = Number(formData.year);
    if (!Number.isFinite(y)) err.year = 'Year cannot be empty.';
    else if (y < YEAR_MIN || y > YEAR_MAX) err.year = `Year must be between ${YEAR_MIN} and ${YEAR_MAX}.`;

    const p = Number(formData.price);
    if (!Number.isFinite(p)) err.price = 'Price cannot be empty.';
    else if (p < PRICE_MIN || p > PRICE_MAX) err.price = `Price must be between ${PRICE_MIN} and ${PRICE_MAX}.`;

    const m = Number(formData.mileage);
    if (!Number.isFinite(m)) err.mileage = 'Mileage cannot be empty.';
    else if (m < 0) err.mileage = 'Mileage must be >= 0.';

    if (/[IOQioq]/.test(formData.vin)) {
      err.vin = 'VIN cannot contain I, O or Q.';
    }

    return err;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerMessage(null);

    const clientErrors = validate();
    if (Object.keys(clientErrors).length) {
      setValidationErrors(clientErrors);
      return;
    }

    // UI -> payload (el padre mapea submodel -> subModel al backend)
    const payload = {
      id: formData.id ?? (vehicle?.id ?? null),
      vin: String(formData.vin).toUpperCase().replace(VIN_FORBIDDEN, ''),
      year: Number(formData.year),
      make: formData.make.trim(),
      model: formData.model.trim(),
      submodel: formData.submodel?.trim() || '',
      transmission: formData.transmission,
      mileage: Number(formData.mileage),
      color: formData.color.trim(),
      price: Number(formData.price),
      image: formData.image?.trim() || ''
    };

    try {
      setSubmitting(true);
      await onSave(payload); // el padre hace POST/PUT y muestra éxito
      handleClose();
    } catch (err) {
      const status = err?.response?.status;
      if (status === 400 && err.response?.data?.errors) {
        // Mapear errores backend -> nombres de inputs (subModel -> submodel)
        const be = err.response.data.errors;
        const mapped = { ...be };
        if (be.subModel && !be.submodel) {
          mapped.submodel = be.subModel;
          delete mapped.subModel;
        }
        setValidationErrors(mapped);
      } else if (status === 409) {
        setServerMessage(err.response?.data?.message || 'Cannot add car with same VIN.');
      } else if (err.response?.data?.message) {
        setServerMessage(err.response.data.message);
      } else {
        setServerMessage('Save failed.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className={`vehicle-form-overlay ${showForm ? 'show' : ''}`}
      onClick={handleOverlayClick}
    >
      <div className="vehicle-form-container">
        <button className="close-form-btn" onClick={handleClose} aria-label="Close">
          ×
        </button>

        <div className="vehicle-form-header">
          <h2>{isEditing ? 'Edit Vehicle' : 'Add New Vehicle'}</h2>
          <p className="form-subtitle">Enter the details of the vehicle</p>
        </div>

        {serverMessage && (
          <div className="error-message" role="alert" style={{ marginBottom: 12 }}>
            {serverMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="vehicle-form" noValidate>
          <div className="form-group">
            <label htmlFor="vin">VIN</label>
            <input
              type="text"
              id="vin"
              name="vin"
              placeholder="e.g. 1HGBH41JXMN109186"
              value={formData.vin}
              onChange={handleChange}
              disabled={submitting}
              maxLength={17}
              autoComplete="off"
              inputMode="latin"
            />
            {validationErrors.vin && (
              <span className="error-message">{validationErrors.vin}</span>
            )}
            <small className="field-hint">
              VIN is uppercase and cannot contain I, O, or Q.
            </small>
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
                disabled={submitting}
                autoComplete="off"
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
                disabled={submitting}
                autoComplete="off"
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
                min={YEAR_MIN}
                max={YEAR_MAX}
                disabled={submitting}
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
                disabled={submitting}
                autoComplete="off"
                required
              />
              {validationErrors.submodel && (
                <span className="error-message">{validationErrors.submodel}</span>
              )}
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
                disabled={submitting}
              >
                <option value="Automatic">Automatic</option>
                <option value="Manual">Manual</option>
              </select>
              {validationErrors.transmission && (
                <span className="error-message">{validationErrors.transmission}</span>
              )}
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
                disabled={submitting}
                inputMode="numeric"
                autoComplete="off"
              />
              <small className="field-hint">Enter mileage in miles</small>
              {validationErrors.mileage && (
                <span className="error-message">{validationErrors.mileage}</span>
              )}
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
                disabled={submitting}
                autoComplete="off"
              />
              {validationErrors.color && (
                <span className="error-message">{validationErrors.color}</span>
              )}
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
                  disabled={submitting}
                  inputMode="decimal"
                  autoComplete="off"
                  className={`price-input ${validationErrors.price ? 'error' : ''}`}
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
              disabled={submitting}
              autoComplete="off"
              required
            />
            {validationErrors.image && (
              <span className="error-message">{validationErrors.image}</span>
            )}
          </div>

          {formData.image && (
            <div className="image-preview-container">
              <p>Image Preview:</p>
              <div className="image-preview">
                <img
                  src={formData.image}
                  alt="Vehicle preview"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src =
                      'https://via.placeholder.com/400x200/1a1a1a/ffffff?text=Image+Not+Found';
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
              disabled={submitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`save-btn ${submitting ? 'submitting' : ''}`}
              disabled={submitting}
            >
              {submitting ? (
                <>
                  <span className="button-loader"></span>
                  <span>Saving...</span>
                </>
              ) : isEditing ? (
                'Update Vehicle'
              ) : (
                'Add Vehicle'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VehicleForm;
