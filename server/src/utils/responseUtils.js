const logger = require("./logger");

/**
 * Creates a base response object.
 * @param {boolean} success - Indicates if the operation was successful.
 * @param {string} message - A message related to the response.
 * @param {any} [data] - Any additional data to include.
 * @returns {Object} - The standardized response object.
 */
const createResponseObject = (success, message, data = null) => {
  return {
    success,
    message,
    ...(data && { data }), // Only include the 'data' field if data is not null
  };
};

/**
 * Sends a standardized success response.
 * @param {Response} res - Express response object.
 * @param {any} data - The data to send back.
 * @param {number} [statusCode=200] - HTTP status code.
 */
const successResponse = (
  res,
  data,
  message = "Operation successful",
  statusCode = 200
) => {
  const response = createResponseObject(true, message, data);
  res.status(statusCode).json(response);
};

/**
 * Sends a standardized error response.
 * @param {Response} res - Express response object.
 * @param {string} error - Error message to send back.
 * @param {number} [statusCode=500] - HTTP status code.
 * @param {Error} [errObj] - Optional error object to log.
 */
const errorResponse = (res, error, statusCode = 500, errObj = null) => {
  if (errObj) {
    // Log the error object with a stack trace or as a JSON string
    if (errObj instanceof Error) {
      logger.error(errObj.message, errObj.stack ? errObj.stack : ""); // Log stack trace if it's an Error object
    } else {
      logger.error(JSON.stringify(errObj, null, 2)); // Log other objects in a readable JSON format
    }
  } else {
    logger.error(error); // Log the error message if no object is provided
  }

  const response = createResponseObject(false, error);
  res.status(statusCode).json(response);
};

/**
 * Sends a response for validation failures.
 * @param {Response} res - Express response object.
 * @param {string} message - Validation error message.
 */
const validationErrorResponse = (res, message) => {
  errorResponse(res, message, 400);
};

module.exports = {
  successResponse,
  errorResponse,
  validationErrorResponse,
};