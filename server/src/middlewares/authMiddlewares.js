const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const asyncHandler = require("../error/asyncHandler");
const apiError = require("../error/apiError");

const isAuthenticated = asyncHandler(async (req, res, next) => {
  const { token } = req.cookies;

  if (!token) {
    throw new apiError(400, "User not logged in");
  }

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
