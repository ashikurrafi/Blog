// This class is used to create structured response objects for API success cases.

class apiResponse {
  /**
   * Creates an instance of apiResponse.
   * @param {number} statusCode - The HTTP status code representing the response (e.g., 200 for success).
   * @param {Object} data - The data to be included in the response body (e.g., user data, success message).
   * @param {string} message - A success message (default is "Success").
   */

  constructor(statusCode, data, message = "Success") {
    this.statusCode = statusCode; // HTTP status code
    this.data = data; // Data to be included in the response body
    this.message = message; // Success message
    this.success = statusCode >= 100 && statusCode <= 599; // Indicates the success of the request
  }
}

module.exports = apiResponse;
