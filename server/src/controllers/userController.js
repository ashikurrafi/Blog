import apiError from '../errors/apiError.js';
import apiResponse from '../errors/apiResponse.js';
import asyncHandler from '../errors/asyncHandler.js';
import userModel from '../models/userModel.js';
import { cascadeDeleteUser } from '../utils/cascadeDelete.js';
import cloudinary, { deleteFromCloudinary } from '../utils/cloudinary.js';
import getDataUri from '../utils/dataUri.js';

export const getAllUsers = asyncHandler(async (req, res) => {
  const users = await userModel
    .find()
    .select('-password')
    .sort({ createdAt: -1 });

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
  const { name, password, superName } = req.body;
  const file = req.file;
  const { userId } = req.params;

  const user = await userModel.findById(userId).select('+password');

  if (!user) {
    throw new apiError(404, 'User not found');
  }

  // Only the user themselves or admin can update
  if (req.user.role !== 'admin' && req.user._id.toString() !== userId) {
    throw new apiError(403, 'You can only update your own profile');
  }

  if (file) {
    // Delete old photo from Cloudinary before uploading new one
    if (user.photoUrl) {
      await deleteFromCloudinary(user.photoUrl);
    }
    const fileUri = getDataUri(file);
    const cloudResponse = await cloudinary.uploader.upload(fileUri);
    user.photoUrl = cloudResponse.secure_url;
  }

  if (name) user.name = name;
  if (password) user.password = password;

  if (
    superName !== undefined &&
    (user.role === 'superuser' || user.role === 'admin')
  ) {
    user.superName = superName;
  }

  await user.save();

  const userObj = user.toObject();
  delete userObj.password;

  const response = new apiResponse(
    200,
    userObj,
    'User updated successfully',
    true,
  );

  res.status(response.statusCode).json(response);
});

export const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Only the user themselves or admin can delete
  if (req.user.role !== 'admin' && req.user._id.toString() !== id) {
    throw new apiError(403, 'You can only delete your own account');
  }

  const user = await userModel.findById(id);
  if (!user) {
    throw new apiError(404, 'User not found');
  }

  // Cascade delete: blogs + blog images + comments + profile photo + user
  await cascadeDeleteUser(id);

  const response = new apiResponse(
    200,
    null,
    'Account and all associated data deleted successfully',
    true,
  );

  // Clear auth cookie
  res
    .status(response.statusCode)
    .clearCookie('token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    })
    .json(response);
});
