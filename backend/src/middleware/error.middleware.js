import { sendError } from '../utils/apiResponse.js';

/**
 * 404 Route Not Found Middleware
 */
export const notFoundHandler = (req, res, next) => {
  return sendError(res, `Endpoint not found: ${req.method} ${req.originalUrl}`, 404, 'NOT_FOUND');
};

/**
 * Centralized Global Error Handler
 */
export const errorHandler = (err, req, res, next) => {
  const isDev = process.env.NODE_ENV === 'development';

  if (isDev) {
    console.error('[Centralized Error Handler]:', err);
  }

  // Handle specific known error types
  if (err.type === 'entity.parse.failed') {
    return sendError(res, 'Malformed JSON payload.', 400, 'BAD_REQUEST');
  }

  // PostgreSQL unique violation
  if (err.code === '23505') {
    return sendError(res, 'A duplicate record already exists.', 409, 'DUPLICATE_KEY');
  }

  // PostgreSQL foreign key violation
  if (err.code === '23503') {
    return sendError(res, 'Referenced record was not found.', 400, 'FOREIGN_KEY_VIOLATION');
  }

  const statusCode = err.statusCode || 500;
  const message = err.message || 'An unexpected internal server error occurred.';
  const errorCode = err.errorCode || 'INTERNAL_ERROR';

  return sendError(
    res,
    message,
    statusCode,
    errorCode,
    null
  );
};
