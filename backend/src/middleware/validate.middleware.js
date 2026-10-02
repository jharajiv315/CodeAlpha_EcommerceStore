import { sendError } from '../utils/apiResponse.js';

/**
 * Validates User Registration body
 */
export const validateRegister = (req, res, next) => {
  const { name, email, password } = req.body;

  if (!name || typeof name !== 'string' || name.trim().length < 2) {
    return sendError(res, 'Name must be at least 2 characters long.', 400, 'VALIDATION_ERROR');
  }

  if (!email || typeof email !== 'string') {
    return sendError(res, 'A valid email address is required.', 400, 'VALIDATION_ERROR');
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.trim())) {
    return sendError(res, 'Invalid email address format.', 400, 'VALIDATION_ERROR');
  }

  if (!password || typeof password !== 'string' || password.length < 6) {
    return sendError(res, 'Password must be at least 6 characters long.', 400, 'VALIDATION_ERROR');
  }

  next();
};

/**
 * Validates User Login body
 */
export const validateLogin = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || typeof email !== 'string' || !email.trim()) {
    return sendError(res, 'Email is required.', 400, 'VALIDATION_ERROR');
  }

  if (!password || typeof password !== 'string') {
    return sendError(res, 'Password is required.', 400, 'VALIDATION_ERROR');
  }

  next();
};

/**
 * Validates Order Creation request
 */
export const validateCreateOrder = (req, res, next) => {
  const { items, shippingAddress } = req.body;

  if (!Array.isArray(items) || items.length === 0) {
    return sendError(res, 'Order must contain at least one item.', 400, 'EMPTY_CART');
  }

  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    if (!item.productId || typeof item.productId !== 'string') {
      return sendError(res, `Item at index ${i} is missing a valid productId.`, 400, 'INVALID_ITEM');
    }
    const qty = Number(item.quantity);
    if (!Number.isInteger(qty) || qty <= 0) {
      return sendError(res, `Quantity for item ${item.productId} must be a positive integer.`, 400, 'INVALID_QUANTITY');
    }
  }

  if (!shippingAddress || typeof shippingAddress !== 'object') {
    return sendError(res, 'Shipping address is required.', 400, 'MISSING_SHIPPING_ADDRESS');
  }

  const { fullName, email, phone, addressLine, city, state, postalCode } = shippingAddress;

  if (!fullName || typeof fullName !== 'string' || fullName.trim().length < 2) {
    return sendError(res, 'Recipient full name is required.', 400, 'INVALID_SHIPPING');
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(String(email).trim())) {
    return sendError(res, 'A valid recipient email address is required.', 400, 'INVALID_SHIPPING');
  }

  const phoneClean = String(phone || '').replace(/[\s\-\(\)]/g, '');
  if (!phoneClean || phoneClean.length < 10) {
    return sendError(res, 'A valid 10-digit mobile number is required.', 400, 'INVALID_SHIPPING');
  }

  if (!addressLine || typeof addressLine !== 'string' || addressLine.trim().length < 5) {
    return sendError(res, 'Complete street address is required.', 400, 'INVALID_SHIPPING');
  }

  if (!city || typeof city !== 'string' || !city.trim()) {
    return sendError(res, 'City is required.', 400, 'INVALID_SHIPPING');
  }

  if (!state || typeof state !== 'string' || !state.trim()) {
    return sendError(res, 'State/Province is required.', 400, 'INVALID_SHIPPING');
  }

  const pinClean = String(postalCode || '').replace(/\s/g, '');
  if (!pinClean || pinClean.length < 5) {
    return sendError(res, 'A valid postal code is required.', 400, 'INVALID_SHIPPING');
  }

  next();
};
