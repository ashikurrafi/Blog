import fs from "fs";
import path from "path";
import apiError from "../error/apiError.js";
import apiResponse from "../error/apiResponse.js";
import asyncHandler from "../error/asyncHandler.js";
import userModel from "../models/userModel.js";

export const deleteUser = asyncHandler(async (req, res) => {
  const userId = req.params.id;
  const requestingUserId = req.user._id;

  // Check if user is trying to delete their own account or if they're an admin
  if (userId !== requestingUserId.toString() && req.user.role !== "admin") {
    throw new apiError(403, "You can only delete your own account");
  }

  // Find the user to be deleted
  const userToDelete = await userModel.findById(userId);
  if (!userToDelete) {
    throw new apiError(404, "User not found");
  }

  // Prevent admin deletion (additional safety check)
  if (userToDelete.role === "admin" && userId === requestingUserId.toString()) {
    throw new apiError(403, "Admin users cannot delete their own account");
  }

  // Delete user's profile image if it exists
  if (userToDelete.image) {
    const imagePath = path.join(
      process.cwd(),
      "src/public/images",
      userToDelete.image
    );
    if (fs.existsSync(imagePath)) {
      try {
        fs.unlinkSync(imagePath);
      } catch (error) {
        console.error("Error deleting user image:", error);
      }
    }
  }

  // TODO: You might want to handle related data cleanup here
  // For example, delete user's blogs, comments, etc.
  // This depends on your business requirements

  // Delete the user
  await userModel.findByIdAndDelete(userId);

  res.json(
    new apiResponse(200, null, "User account deleted successfully", true)
  );
});

export const updateUser = asyncHandler(async (req, res) => {
  const userId = req.user._id; // Fixed: use req.user._id instead of req.id
  const { name, password, phone, bio, address, bloodGrp } = req.body;
  const file = req.file;

  const user = await userModel.findById(userId).select("-password");

  if (!user) {
    throw new apiError(404, "User not found");
  }

  // Fixed: Update the correct fields
  if (name) user.name = name;
  if (phone) user.phone = phone;
  if (bio) user.bio = bio;
  if (address) user.address = address;
  if (bloodGrp) user.bloodGrp = bloodGrp;

  // Handle password update separately if needed
  if (password) {
    user.password = password; // This will be hashed by the pre-save middleware
  }

  // Handle file upload
  if (file) {
    // Delete old image if exists
    if (user.image) {
      const oldImagePath = path.join(
        process.cwd(),
        "src/public/images",
        user.image
      );
      if (fs.existsSync(oldImagePath)) {
        try {
          fs.unlinkSync(oldImagePath);
        } catch (error) {
          console.error("Error deleting old image:", error);
        }
      }
    }
    user.image = file.filename;
  }

  await user.save();

  return res
    .status(200)
    .json(
      new apiResponse(200, { user: user }, "Profile updated successfully", true)
    );
});
