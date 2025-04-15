const asyncHandler = require("../error/asyncHandler");
const apiError = require("../error/apiError");
const apiResponse = require("../error/apiResponse");

const User = require("../models/userModel");
const { sendEmail } = require("../utils/sendEmail");
const sendToken = require("../utils/sendToken");

const crypto = require("crypto");

const registerUser = asyncHandler(async (req, res, next) => {
  const { name, email, phone, password } = req.body;

  // Validate required fields
  if (!name || !email || !phone || !password) {
    throw new apiError(
      400,
      "Please provide all required fields: name, email, phone, and password."
    );
  }

  // Validate phone number format
  function validatePhoneNumber(phone) {
    const phoneRegex = /^\+880\d{10}$/;
    return phoneRegex.test(phone);
  }

  // Check if the phone number is valid
  if (!validatePhoneNumber(phone)) {
    throw new apiError(
      400,
      "Invalid phone number format. Please use +880XXXXXXXXXX format."
    );
  }

  // Check if the email already exists
  const existingUser = await User.findOne({
    email,
    accountVerified: true,
  });

  // Check if the email is already registered
  if (existingUser) {
    throw new apiError(400, "Email is already registered.");
  }

  const registrationAttemptByUser = await User.find({
    email,
    accountVerified: false,
  });

  if (registrationAttemptByUser.length >= 5) {
    throw new apiError(
      400,
      "You have exceeded the maximum number of registration attempts. Please try after 1hr."
    );
  }

  // Create a new user
  const userData = new User({
    name,
    email,
    phone,
    password,
  });

  try {
    // Create user
    const user = await User.create(userData);

    const verificationCode = await user.generateVerificationCode();
    await user.save();

    // Pass res to the sendVerificationCode function
    sendVerificationCode(verificationCode, email, user, res);
  } catch (error) {
    // Check if it's a duplicate key error (usually happens for email or phone uniqueness)
    if (error.code === 11000) {
      throw new apiError(400, "Email or phone number already exists.");
    }

    // Handle other types of errors
    throw new apiError(500, "An error occurred while registering the user.");
  }
});

async function sendVerificationCode(verificationCode, email, user, res) {
  try {
    const message = generateEmailTemplate(verificationCode);

    await sendEmail({ email, subject: "Your Verification Code", message });

    // Respond with success after sending the email
    const response = new apiResponse(
      201,
      user,
      "User registered successfully."
    );
    res.status(response.statusCode).json(response);
  } catch (error) {
    throw new apiError(
      500,
      "Error sending verification code. Please try again later."
    );
  }
}

function generateEmailTemplate(verificationCode) {
  return `
  <html>
  <body>
    <h1>Verification Code</h1>
    <p>Your verification code is: ${verificationCode}</p>
  </body>
</html>
`;
}

const verifyOTP = asyncHandler(async (req, res, next) => {
  const { email, otp } = req.body;

  const userAllEntries = await User.find({
    email,
    accountVerified: false,
  }).sort({
    createdAt: -1,
  });

  if (!userAllEntries || userAllEntries.length === 0) {
    throw new apiError(400, "No registration attempts found for this email.");
  }

  let user;

  if (userAllEntries.length > 1) {
    user = userAllEntries[0];
    await User.deleteMany({
      _id: { $ne: user._id },
      $or: [
        {
          phone: user.phone,
          accountVerified: false,
        },
      ],
    });
  } else {
    user = userAllEntries[0];
  }

  if (user.verificationCode !== Number(otp)) {
    throw new apiError(400, "Invalid verification code.");
  }

  const currentTime = Date.now();
  const verificationCodeExpiry = new Date(
    user.verificationCodeExpiry
  ).getTime();

  if (currentTime > verificationCodeExpiry) {
    throw new apiError(400, "Verification code has expired.");
  }

  user.accountVerified = true;
  user.verificationCode = null;
  user.verificationCodeExpiry = null;

  await user.save({
    validateModifiedOnly: true,
  });

  sendToken(user, 200, "Account Verified", res);
});

const loginUser = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new apiError(400, "Please provide email and password.");
  }

  const user = await User.findOne({ email, accountVerified: true }).select(
    "+password"
  );

  if (!user) {
    throw new apiError(401, "No user found.");
  }

  const isPasswordMatched = await user.comparePassword(password);

  if (!isPasswordMatched) {
    throw new apiError(401, "Invalid email or password.");
  }

  sendToken(user, 200, "Login successful", res);
});

const logoutUser = asyncHandler(async (req, res, next) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  });
  res.status(200).json(new apiResponse(200, null, "Successfully logged out"));
});

const getUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id).select("-password");

  if (!user) {
    throw new apiError(404, "User not found.");
  }

  const response = new apiResponse(200, user, "User fetched successfully.");
  res.status(response.statusCode).json(response);
});

const forgotPassword = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({
    email: req.body.email,
    accountVerified: true,
  });

  if (!user) {
    throw new apiError(400, "User not found");
  }

  const resetToken = user.generateResetPasswordToken();
  console.log("Token :", resetToken);
  await user.save({
    validateBeforeSave: false,
  });

  const resetPasswordUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

  const message = `You are receiving this email because you (or someone else) has requested the reset of a password. Please make a PUT request to: \n\n ${resetPasswordUrl} \n\n If you did not request this, please ignore this email and your password will remain unchanged.`;

  try {
    await sendEmail({
      email: user.email,
      subject: "Password Reset Token",
      message,
    });

    const response = new apiResponse(
      200,
      user,
      resetToken,
      "Reset password token sent to your email."
    );
    res.status(response.statusCode).json(response);
  } catch (error) {
    // Handle other types of errors

    user.resetPasswordToken = undefined;
    user.resetPasswordTokenExpiry = undefined;

    await user.save({
      validateBeforeSave: false,
    });

    throw new apiError(500, "Error sending email. Please try again later.");
  }
});

const resetPassword = asyncHandler(async (req, res, next) => {
  const { token } = req.params;

  const resetPasswordToken = crypto
    .createHash("sha512")
    .update(token)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordTokenExpiry: { $gt: Date.now() },
  });

  if (!user) {
    throw new apiError(400, "Invalid or expired reset token.");
  }

  if (req.body.password !== req.body.confirmPassword) {
    throw new apiError(400, "Passwords do not match.");
  }

  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordTokenExpiry = undefined;

  await user.save({
    validateBeforeSave: true,
  });

  sendToken(user, 200, "Password reset successful", res);
});

module.exports = {
  registerUser,
  verifyOTP,
  loginUser,
  logoutUser,
  getUser,
  forgotPassword,
  resetPassword,
};
