// Currency formatting utility (safe wrapper)
export const formatPrice = (price, { locale = 'es-AR', currency = 'ARS' } = {}) => {
  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  } catch (e) {
    // Fallback simple formatting
    return `$${Number(price).toLocaleString()}`;
  }
};

export default formatPrice;
