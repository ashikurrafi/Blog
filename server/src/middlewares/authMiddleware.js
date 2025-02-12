const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const authGuard = async (req, res, next) => {
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      const token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id).select("-password");

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      req.user = user; // Add the user to the request object
      console.log("User:", user);
      next(); // Proceed to the next middleware
    } catch (error) {
      return res.status(401).json({
        message: "Not authorized, Token failed",
        error: error.message,
      });
    }
  } else {
    return res.status(401).json({ message: "Not authorized, No token" });
  }
};

const adminGuard = (req, res, next) => {
  if (req.user && req.user.admin) {
    next();
  } else {
    const error = new Error("Not authorized as an admin");
    error.statusCode = 401;
    next(error);
  }
};

module.exports = { authGuard, adminGuard };
