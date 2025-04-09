const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const apiResponse = require("../error/apiResponse"); // Assuming this is correctly defined
const asyncHandler = require("../error/asyncHandler");
const apiError = require("../error/apiError");

const isAuthenticated = asyncHandler(async (req, res, next) => {
  const { token } = req.cookies;

  if (!token) {
    // No token case - User is not logged in
    throw new apiError(400, "User not logged in");
  }

  // const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

  // req.user = await User.findById(decoded.id);
  // if (!req.user) {
  //   // User not found case - Token is invalid
  //   throw new apiError(400, "User not found");
  // }

  // next();

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.user = await User.findById(decoded.id);
    if (!req.user) throw new apiError(400, "User not found");
    next();
  } catch (err) {
    if (err.name === "TokenExpiredError")
      throw new apiError(401, "Token expired");
    throw new apiError(400, "Invalid token");
  }
});

module.exports = isAuthenticated;
