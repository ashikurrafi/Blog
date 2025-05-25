const asyncHandler = require("../error/asyncHandler");
const apiError = require("../error/apiError");
const apiResponse = require("../error/apiResponse");
const User = require("../models/userModel");

const getUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id).select("-password");

  if (!user) {
    throw new apiError(404, "User not found.");
  }

  const response = new apiResponse(200, user, "User fetched successfully.");
  res.status(response.statusCode).json(response);
});

const updateProfile = asyncHandler(async (req, res) => {
  const userId = req.params.id;
  const { name, phone } = req.body;
  const profileImage = req.file.filename;
  console.log(profileImage);
  const ExistUser = await User.findById(userId);
  if (!ExistUser) {
    throw new apiError(404, "User not found.");
  }
  const newUser = { name, phone, profileImage };

  const updatedUser = await User.findByIdAndUpdate(userId, newUser, {
    new: true,
    runValidators: true,
  });

  const response = new apiResponse(
    200,
    updatedUser,
    "Profile updated successfully."
  );
  res.status(response.statusCode).json(response);
});

module.exports = {
  updateProfile,
  getUser,
};
