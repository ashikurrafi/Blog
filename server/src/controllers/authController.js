import jwt from "jsonwebtoken";
import apiError from "../error/apiError.js";
import apiResponse from "../error/apiResponse.js";
import asyncHandler from "../error/asyncHandler.js";
import userModel from "../models/userModel.js";

export const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, phone } = req.body;

  const profilePicture = req.file ? req.filename : null;

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
    profilePicture,
  });

  await newUser.save();

  res.json(new apiResponse(200, newUser, "User registered successfully", true));
});

export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new apiError(400, "Email and password are required");
  }

  const user = await userModel.findOne({ email });

  if (!user) {
    throw new apiError(401, "No user found with this email");
  }

  const isPasswordValid = await user.comparePassword(password);

  if (!isPasswordValid) {
    throw new apiError(401, "Invalid email or password");
  }

  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, {
    expiresIn: "1h",
  });

  res
    .cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Use secure cookies in production
      sameSite: "Strict", // Prevent CSRF attacks
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    })
    .json(
      new apiResponse(200, { user, token }, "User logged in successfully", true)
    );
});
