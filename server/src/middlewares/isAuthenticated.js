import jwt from "jsonwebtoken";
import asyncHandler from "../error/asyncHandler.js";
import userModel from "../models/userModel.js";

const isAuthenticated = asyncHandler(async (req, res, next) => {
  const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.json(
      new apiResponse(404, null, "Access denied. No token provided.", false)
    );
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

  const user = await userModel.findById(decoded.userId);

  if (!user) {
    return res.json(new apiResponse(401, null, "User not found", false));
  }

  req.user = user;
  next();
});

export default isAuthenticated;
