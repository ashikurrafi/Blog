import jwt from 'jsonwebtoken';
import apiError from '../errors/apiError.js';
import apiResponse from '../errors/apiResponse.js';
import asyncHandler from '../errors/asyncHandler.js';
import userModel from '../models/userModel.js';

export const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, phone } = req.body;

  if (!name || !email || !password || !phone) {
    throw new apiError(400, 'All fields are required');
  }

  if (password.length < 8) {
    throw new apiError(400, 'Password must be at least 8 characters');
  }

  const existingUser = await userModel.findOne({
    $or: [{ email: email }, { phone: phone }],
  });

  if (existingUser) {
    throw new apiError(400, 'User with this email or phone already exists');
  }

  const newUser = new userModel({
    name,
    email,
    password,
    phone,
  });

  await newUser.save();

  const { password: _, ...userWithoutPassword } = newUser.toObject();

  const response = new apiResponse(
    201,
    { user: userWithoutPassword },
    'User registered successfully',
    true,
  );

  res.status(response.statusCode).json(response);
});

export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new apiError(400, 'All fields are required');
  }

  const user = await userModel.findOne({ email }).select('+password');

  if (!user) {
    throw new apiError(401, 'Invalid email or password');
  }

  const isPasswordValid = await user.comparePassword(password);

  if (!isPasswordValid) {
    throw new apiError(401, 'Invalid email or password');
  }

  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, {
    expiresIn: '1d',
  });

  const { password: _, ...userWithoutPassword } = user.toObject();

  const response = new apiResponse(
    200,
    { user: userWithoutPassword, token },
    'User logged in successfully',
    true,
  );

  res
    .status(response.statusCode)
    .cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    })
    .json(response);
});

export const logoutUser = asyncHandler(async (req, res) => {
  const response = new apiResponse(
    200,
    null,
    'User logged out successfully',
    true,
  );

  res
    .status(response.statusCode)
    .clearCookie('token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    })
    .json(response);
});
