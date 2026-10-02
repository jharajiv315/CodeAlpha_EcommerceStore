/**
 * Standardized API Response Utilities
 */

export const sendSuccess = (res, data = null, message = 'Success', statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

export const sendError = (res, message = 'Internal Server Error', statusCode = 500, errorCode = null, details = null) => {
  const payload = {
    success: false,
    message,
  };

  if (errorCode || details) {
    payload.error = {
      ...(errorCode ? { code: errorCode } : {}),
      ...(details ? { details } : {}),
    };
  }

  return res.status(statusCode).json(payload);
};
