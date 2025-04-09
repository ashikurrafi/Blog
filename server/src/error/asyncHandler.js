// This is a higher-order function that wraps asynchronous route handlers
// to automatically catch and respond to errors.

const asyncHandler = (func) => async (req, res, next) => {
  try {
    // Execute the passed async function

    await func(req, res, next);
  } catch (error) {
    // If an error occurs, send an error response to the client

    res.status(error.code || 500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = asyncHandler;
