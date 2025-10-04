import apiError from "../errors/apiError.js";
import apiResponse from "../errors/apiResponse.js";
import asyncHandler from "../errors/asyncHandler.js";
import blogModel from "../models/blogModel.js";
import userModel from "../models/userModel.js";
import cloudinary from "../utils/cloudinary.js";
import getDataUri from "../utils/dataUri.js";

export const createUserToAdmin = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  const user = await userModel.findById(userId).select("+password");

  if (!user) {
    throw new apiError(404, "User not found");
  }

  user.role = "admin";
  await user.save();

  const response = new apiResponse(
    200,
    "User promoted to admin successfully",
    true
  );
  res.status(response.statusCode).json(response);
});

export const createAdminToUser = asyncHandler(async (req, res) => {
  const { adminId } = req.params;

  const admin = await userModel.findById(adminId).select("+password");

  if (!admin) {
    throw new apiError(404, "Admin not found");
  }
  admin.role = "user";
  await admin.save();

  const response = new apiResponse(
    200,
    "Admin demoted to user successfully",
    true
  );
  res.status(response.statusCode).json(response);
});

export const deleteUserByAdmin = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const user = await userModel.findById(userId);

  if (!user) {
    throw new apiError(404, "User not found");
  }

  // Delete all blogs associated with the user
  await blogModel.deleteMany({ author: userId });

  await userModel.findByIdAndDelete(userId);

  const response = new apiResponse(
    200,
    "User and associated blogs deleted successfully",
    true
  );
  res.status(response.statusCode).json(response);
});

export const updateUserByAdmin = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const { name, email, phone } = req.body;

  const file = req.file;

  const user = await userModel.findById(userId);

  if (!user) {
    throw new apiError(404, "User not found");
  }

  if (file) {
    const fileUri = getDataUri(file);
    const cloudResponse = await cloudinary.uploader.upload(fileUri);
    user.photoUrl = cloudResponse.secure_url;
  }

  // Update user fields if provided
  if (name) user.name = name;
  if (email) user.email = email;
  if (phone) user.phone = phone;

  await user.save();

  const response = new apiResponse(
    200,
    user,
    "User updated successfully",
    true
  );
  res.status(response.statusCode).json(response);
});

export const getAllAdmins = asyncHandler(async (req, res) => {
  const admins = await userModel.find({ role: "admin" }).select("-password");
  const response = new apiResponse(
    200,
    admins,
    "Admins retrieved successfully",
    true
  );
  res.status(response.statusCode).json(response);
});

export const getAdminById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const admin = await userModel.findById(id).select("-password");

  if (!admin || admin.role !== "admin") {
    throw new apiError(404, "Admin not found");
  }

  const response = new apiResponse(
    200,
    admin,
    "Admin retrieved successfully",
    true
  );
  res.status(response.statusCode).json(response);
});

export const deleteAdmin = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const admin = await userModel.findById(id);

  if (!admin || admin.role !== "admin") {
    throw new apiError(404, "Admin not found");
  }

  await blogModel.deleteMany({ user: id });

  await admin.remove();

  const response = new apiResponse(
    200,
    null,
    "Admin deleted successfully",
    true
  );
  res.status(response.statusCode).json(response);
});

export const updateAdmin = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, email, phone, role } = req.body;
  const file = req.file;

  const admin = await userModel.findById(id);

  if (!admin || admin.role !== "admin") {
    throw new apiError(404, "Admin not found");
  }

  if (file) {
    const fileUri = getDataUri(file);
    const cloudResponse = await cloudinary.uploader.upload(fileUri);
    admin.photoUrl = cloudResponse.secure_url;
  }

  // Update admin fields if provided
  if (name) admin.name = name;
  if (email) admin.email = email;
  if (phone) admin.phone = phone;
  if (role) admin.role = role;

  await admin.save();

  const response = new apiResponse(
    200,
    admin,
    "Admin updated successfully",
    true
  );
  res.status(response.statusCode).json(response);
});
