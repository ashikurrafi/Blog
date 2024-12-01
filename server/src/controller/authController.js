import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { nanoid } from "nanoid";
import User from "../model/User.js";

const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()\-_+=<>?]).{8,20}$/;

// Utility function to send error response
const sendErrorResponse = (res, statusCode, message) => {
  return res.status(statusCode).json({ error: message });
};

// Password hashing utility
const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

// Format data to send (excluding sensitive info like password)
const formatDataToSend = (user) => {
  const access_token = jwt.sign({ id: user._id }, process.env.JWT_ACCESS_KEY);
  return {
    access_token,
    profile_img: user.personal_info.profile_img,
    username: user.personal_info.username,
    fullname: user.personal_info.fullname,
  };
};

// Function to generate unique username
const generateUserName = async (email) => {
  let username = email.split("@")[0]; // Create a username from the email prefix

  // Check if the username exists in the database
  let usernameExists = await User.exists({
    "personal_info.username": username,
  });

  // If username exists, append a nanoid to make it unique
  while (usernameExists) {
    username = `${username}_${nanoid().substring(0, 5)}`;
    usernameExists = await User.exists({
      "personal_info.username": username,
    });
  }

  return username;
};

export const signup = async (req, res) => {
  try {
    const { fullname, email, password } = req.body;

    // Validation checks
    if (fullname.length < 3) {
      return sendErrorResponse(
        res,
        400,
        "Fullname must be at least 3 characters long"
      );
    }

    if (!email.length) {
      return sendErrorResponse(res, 400, "Email is required");
    }

    if (!emailRegex.test(email)) {
      return sendErrorResponse(res, 400, "Email is invalid");
    }

    if (!passwordRegex.test(password)) {
      return sendErrorResponse(
        res,
        400,
        "Password must be 8-20 characters long, include uppercase, lowercase, numbers, and special characters"
      );
    }

    // Check if the user already exists
    const existingUser = await User.findOne({ "personal_info.email": email });
    if (existingUser) {
      return sendErrorResponse(res, 400, "Email is already registered");
    }

    // Hash the password
    const hashedPassword = await hashPassword(password);

    // Generate a unique username based on email
    const username = await generateUserName(email);

    // Create a new user document
    const user = new User({
      personal_info: {
        fullname,
        email,
        password: hashedPassword,
        username,
      },
    });

    // Save the user to the database
    const savedUser = await user.save();

    // Respond with the user data, excluding the password
    return res.status(201).json(formatDataToSend(savedUser)); // Pass the full savedUser object here
  } catch (error) {
    console.error(error);
    return sendErrorResponse(res, 500, "Internal Server Error");
  }
};

// Signin function
export const signin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation checks
    if (!email.length) {
      return sendErrorResponse(res, 400, "Email is required");
    }

    if (!emailRegex.test(email)) {
      return sendErrorResponse(res, 400, "Email is invalid");
    }

    if (!passwordRegex.test(password)) {
      return sendErrorResponse(
        res,
        400,
        "Password must be 8-20 characters long, include uppercase, lowercase, numbers, and special characters"
      );
    }

    // Find user by email
    const user = await User.findOne({ "personal_info.email": email });

    if (!user) {
      return sendErrorResponse(res, 403, "Email not found");
    }

    // Compare provided password with the stored hashed password
    const passwordMatch = await bcrypt.compare(
      password,
      user.personal_info.password
    );

    if (!passwordMatch) {
      return sendErrorResponse(res, 403, "Invalid password");
    }

    // If login is successful, return user info (excluding password)
    const { password: _, ...userData } = user.toObject(); // Exclude password
    return res.status(200).json({
      message: "Login successful",
      user: formatDataToSend(userData), // Pass the full savedUser object here
    });
  } catch (error) {
    console.error(error);
    return sendErrorResponse(res, 500, "Internal Server Error");
  }
};
