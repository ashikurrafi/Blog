import apiError from "../errors/apiError.js";
import asyncHandler from "../errors/asyncHandler.js";

const isAdmin = asyncHandler(async (req, res, next) => {
  if (!req.user || req.user?.role !== "admin") {
    throw new apiError(403, "Not authorized as an admin");
  }
  next();
});

export default isAdmin;
