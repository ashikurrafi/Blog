import apiError from "../error/apiError.js";
import apiResponse from "../error/apiResponse.js";
import asyncHandler from "../error/asyncHandler.js";
import userModel from "../models/userModel.js";

export const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, phone } = req.body;

  if (!name || !email || !password || !phone) {
    throw new apiError(400, "All fields are required");
  }

  const existingUser = await userModel.findOne({ email });

  if (existingUser) {
    throw new apiError(400, "User with this email already exists");
  }

  const newUser = new userModel({
    name,
    email,
    password,
    phone,
  });

  await newUser.save();

  res.json(new apiResponse(200, newUser, "User registered successfully", true));
});
