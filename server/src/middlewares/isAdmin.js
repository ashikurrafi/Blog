import jwt from "jsonwebtoken";
import apiError from "../error/apiError.js";
import asyncHandler from "../error/asyncHandler.js";
import userModel from "../models/userModel.js";

const isAdmin = asyncHandler(async (req, res, next) => {
  const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

  if (!token) {
    throw new apiError(404, "Access denied. No token provided.");
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

  const user = await userModel.findById(decoded.userId);

  if (!user) {
    // Clear the cookie if user doesn't exist
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
    });
    throw new apiError(401, "User not found");
  }

  if (user.role !== "admin") {
    throw new apiError(
      403,
      "Access denied. You do not have permission to access this resource."
    );
  }

  req.user = user;
  next();
});

export default isAdmin;
