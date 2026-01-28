import apiError from '../errors/apiError.js';
import apiResponse from '../errors/apiResponse.js';
import asyncHandler from '../errors/asyncHandler.js';
import blogModel from '../models/blogModel.js';
import userModel from '../models/userModel.js';
import cloudinary from '../utils/cloudinary.js';
import getDataUri from '../utils/dataUri.js';

export const getAllUsers = asyncHandler(async (req, res) => {
  const users = await userModel.find().select('-password').sort({ points: -1 });

  const response = new apiResponse(
    200,
    users,
    'Users fetched successfully',
    true,
  );

  res.status(response.statusCode).json(response);
});

export const getUserById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const user = await userModel.findById(id).select('-password');

  if (!user) {
    throw new apiError(404, 'User not found');
  }

  const response = new apiResponse(
    200,
    user,
    'User fetched successfully',
    true,
  );

  res.status(response.statusCode).json(response);
});

export const updateUserProfile = asyncHandler(async (req, res) => {
  const { name, password } = req.body;
  const file = req.file;

  const { userId } = req.params;

  console.log(userId);

  const user = await userModel.findById(userId).select('-password');

  if (!user) {
    throw new apiError(404, 'User not found');
  }

  if (file) {
    const fileUri = getDataUri(file);
    const cloudResponse = await cloudinary.uploader.upload(fileUri);
    user.photoUrl = cloudResponse.secure_url;
  }

  if (name) {
    user.name = name;
  }

  if (password) {
    user.password = password;
  }

  await user.save();

  const response = new apiResponse(
    200,
    user,
    'User updated successfully',
    true,
  );

  res.status(response.statusCode).json(response);
});

export const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const user = await userModel.findByIdAndDelete(id);

  if (!user) {
    throw new apiError(404, 'User not found');
  }

  const blogs = await blogModel.deleteMany({ author: id });

  const response = new apiResponse(
    200,
    null,
    'User and the blogs deleted successfully',
    true,
  );

  res.status(response.statusCode).json(response);
});
