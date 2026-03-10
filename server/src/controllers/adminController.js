import apiError from '../errors/apiError.js';
import apiResponse from '../errors/apiResponse.js';
import asyncHandler from '../errors/asyncHandler.js';
import userModel from '../models/userModel.js';
import { cascadeDeleteUser } from '../utils/cascadeDelete.js';
import cloudinary, { deleteFromCloudinary } from '../utils/cloudinary.js';
import getDataUri from '../utils/dataUri.js';

// Get all users (admin only)
export const getAllUsers = asyncHandler(async (req, res) => {
  const users = await userModel
    .find()
    .select('-password')
    .sort({ createdAt: -1 });

  const response = new apiResponse(
    200,
    users,
    'Users retrieved successfully',
    true,
  );

  res.status(response.statusCode).json(response);
});

// Toggle user role (admin <-> user)
export const toggleUserRole = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const { role } = req.body;

  const user = await userModel.findById(userId);
  if (!user) throw new apiError(404, 'User not found');

  // Validate role
  if (!['user', 'admin'].includes(role)) {
    throw new apiError(400, 'Invalid role. Must be "user" or "admin"');
  }

  user.role = role;
  await user.save();

  const userObj = user.toObject();
  delete userObj.password;

  const response = new apiResponse(
    200,
    userObj,
    `User role updated to ${role} successfully`,
    true,
  );

  res.status(response.statusCode).json(response);
});

// Delete user by admin
export const deleteUserById = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  const user = await userModel.findById(userId);
  if (!user) throw new apiError(404, 'User not found');

  // Full cascade delete
  await cascadeDeleteUser(userId);

  const response = new apiResponse(200, null, 'User deleted successfully', true);

  res.status(response.statusCode).json(response);
});

export const createUserToAdmin = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  const user = await userModel.findById(userId);
  if (!user) throw new apiError(404, 'User not found');

  user.role = 'admin';
  await user.save();

  const response = new apiResponse(
    200,
    user,
    'User promoted to admin successfully',
    true,
  );

  res.status(response.statusCode).json(response);
});

export const createAdminToUser = asyncHandler(async (req, res) => {
  const { adminId } = req.params;

  const admin = await userModel.findById(adminId);
  if (!admin) throw new apiError(404, 'Admin not found');

  admin.role = 'user';
  await admin.save();

  const response = new apiResponse(
    200,
    admin,
    'Admin demoted to user successfully',
    true,
  );

  res.status(response.statusCode).json(response);
});

export const deleteUserByAdmin = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  const user = await userModel.findById(userId);
  if (!user) throw new apiError(404, 'User not found');

  // Full cascade delete
  await cascadeDeleteUser(userId);

  const response = new apiResponse(
    200,
    null,
    'User and all associated data deleted successfully',
    true,
  );

  res.status(response.statusCode).json(response);
});

export const updateUserByAdmin = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const { name, email, phone } = req.body;
  const file = req.file;

  const user = await userModel.findById(userId);
  if (!user) throw new apiError(404, 'User not found');

  if (file) {
    if (user.photoUrl) await deleteFromCloudinary(user.photoUrl);
    const fileUri = getDataUri(file);
    const cloudResponse = await cloudinary.uploader.upload(fileUri);
    user.photoUrl = cloudResponse.secure_url;
  }

  if (name) user.name = name;
  if (email) user.email = email;
  if (phone) user.phone = phone;

  await user.save();

  const response = new apiResponse(
    200,
    user,
    'User updated successfully',
    true,
  );

  res.status(response.statusCode).json(response);
});

export const getAllAdmins = asyncHandler(async (req, res) => {
  const admins = await userModel.find({ role: 'admin' }).select('-password');

  const response = new apiResponse(
    200,
    admins,
    'Admins retrieved successfully',
    true,
  );

  res.status(response.statusCode).json(response);
});

export const getAdminById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const admin = await userModel.findById(id).select('-password');

  if (!admin || admin.role !== 'admin') {
    throw new apiError(404, 'Admin not found');
  }

  const response = new apiResponse(
    200,
    admin,
    'Admin retrieved successfully',
    true,
  );

  res.status(response.statusCode).json(response);
});

export const deleteAdmin = asyncHandler(async (req, res) => {
  const { adminId } = req.params;

  const admin = await userModel.findById(adminId);
  if (!admin || admin.role !== 'admin') {
    throw new apiError(404, 'Admin not found');
  }

  // Full cascade delete
  await cascadeDeleteUser(adminId);

  const response = new apiResponse(
    200,
    null,
    'Admin deleted successfully',
    true,
  );

  res.status(response.statusCode).json(response);
});

export const updateAdmin = asyncHandler(async (req, res) => {
  const { adminId } = req.params;
  const { name, email, phone, role } = req.body;
  const file = req.file;

  const admin = await userModel.findById(adminId);
  if (!admin || admin.role !== 'admin') {
    throw new apiError(404, 'Admin not found');
  }

  if (file) {
    if (admin.photoUrl) await deleteFromCloudinary(admin.photoUrl);
    const fileUri = getDataUri(file);
    const cloudResponse = await cloudinary.uploader.upload(fileUri);
    admin.photoUrl = cloudResponse.secure_url;
  }

  if (name) admin.name = name;
  if (email) admin.email = email;
  if (phone) admin.phone = phone;
  if (role) admin.role = role;

  await admin.save();

  const response = new apiResponse(
    200,
    admin,
    'Admin updated successfully',
    true,
  );

  res.status(response.statusCode).json(response);
});
