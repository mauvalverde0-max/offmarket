/**
 * Input validation middleware
 */

function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

function validatePassword(password) {
  return password && password.length >= 6;
}

function validateProductInput(data) {
  const errors = [];
  if (!data.name || data.name.trim().length === 0) errors.push('Product name is required');
  if (!data.price || data.price <= 0) errors.push('Valid price is required');
  if (!data.store_id || data.store_id <= 0) errors.push('Valid store_id is required');
  return errors;
}

function validateAlertInput(data) {
  const errors = [];
  if (!data.product_id || data.product_id <= 0) errors.push('Valid product_id is required');
  if (!data.target_price || data.target_price <= 0) errors.push('Valid target_price is required');
  return errors;
}

module.exports = {
  validateEmail,
  validatePassword,
  validateProductInput,
  validateAlertInput,
};
