// This class is used to create custom error objects with additional properties
// to standardize API error responses.

class apiError extends Error {
  /**
   * Creates an instance of apiError.
   * @param {number} statusCode - The HTTP status code representing the error (e.g., 404, 500).
   * @param {string} errorMessage - A detailed error message (default is "Something went wrong").
   * @param {Array} errors - An array containing more detailed error information (e.g., validation errors).
   * @param {string} stack - A custom stack trace, if provided, otherwise defaults to generated stack trace.
   */

  constructor(
    statusCode,
    errorMessage = "Something went wrong",
    errors = [],
    stack = ""
  ) {
    // Call the parent Error constructor with the error message
    super(errorMessage);
    this.statusCode = statusCode; // HTTP status code
    this.errorMessage = errorMessage; // Error message
    this.errors = errors; // Detailed array of errors, if applicable (e.g., validation errors)
    this.data = null; // This can be used to send extra information if necessary
    this.success = false; // Indicates the failure of the request

    // Set custom stack trace if provided, else capture a new one
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export default apiError;
